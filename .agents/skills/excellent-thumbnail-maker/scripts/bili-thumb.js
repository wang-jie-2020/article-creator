#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Bilibili 默认高分辨率封面后缀（原图基础上降采样，保留清晰度）
const COVER_SUFFIXES = [
  "",                          // 原图
  "@1920w_1080h",              // 1920x1080
  "@1280w_720h",               // 1280x720
  "@640w_360h",                // 640x360
];

/**
 * 提取视频 ID
 * 支持: BV号, AV号, bilibili.com/video/ 链接, b23.tv 短链接
 */
function extractVideoId(input) {
  if (!input || typeof input !== "string") return null;
  const s = input.trim();

  // 纯 BV 号: BV + 10 位字母数字
  if (/^BV[\w]{10}$/i.test(s)) return { bvid: s };
  // 纯 AV 号: av + 数字
  if (/^av\d+$/i.test(s)) return { aid: Number(s.replace(/^av/i, "")) };

  // bilibili.com/video/BV...
  let m = s.match(/bilibili\.com\/video\/(BV[\w]{10})/i);
  if (m) return { bvid: m[1] };

  // bilibili.com/video/av...
  m = s.match(/bilibili\.com\/video\/av(\d+)/i);
  if (m) return { aid: Number(m[1]) };

  // b23.tv 短链接
  m = s.match(/b23\.tv\/([\w]+)/i);
  if (m) return { shortlink: `https://b23.tv/${m[1]}` };

  return null;
}

/**
 * 解析 b23.tv 短链接，获取真实 BV 号
 */
function resolveShortLink(shortlink, proxy) {
  const args = ["-s", "-L", "-o", "/dev/null", "-w", "%{url_effective}", "--max-time", "10"];
  if (proxy) args.push("-x", proxy);
  args.push(shortlink + "?spm_id_from=333.337.0.0");

  const finalUrl = execFileSync("curl", args, {
    timeout: 15000,
    maxBuffer: 1024 * 1024,
    encoding: "utf8",
  }).trim();

  return extractVideoId(finalUrl);
}

/**
 * 检测代理
 */
function getProxyUrl() {
  const fromEnv =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;
  return fromEnv || "";
}

/**
 * 调用 Bilibili API 获取视频信息
 */
function getVideoInfo(videoId, proxy) {
  let apiUrl;
  if (videoId.bvid) {
    apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${videoId.bvid}`;
  } else if (videoId.aid) {
    apiUrl = `https://api.bilibili.com/x/web-interface/view?aid=${videoId.aid}`;
  } else {
    throw new Error("Invalid video ID: missing bvid or aid");
  }

  const args = [
    "-s", "-L",
    "--max-time", "15",
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "-H", "Referer: https://www.bilibili.com/",
  ];
  if (proxy) args.push("-x", proxy);
  args.push(apiUrl);

  const buf = execFileSync("curl", args, {
    timeout: 20000,
    maxBuffer: 512 * 1024,
    encoding: "utf8",
  });

  let data;
  try {
    data = JSON.parse(buf);
  } catch {
    throw new Error("Failed to parse API response");
  }

  if (data.code !== 0) {
    throw new Error(`API error (code=${data.code}): ${data.message || "unknown"}`);
  }

  return data.data;
}

/**
 * 下载封面图片（尝试不同分辨率，取第一个成功的）
 */
function downloadCover(picUrl, proxy) {
  for (const suffix of COVER_SUFFIXES) {
    const url = suffix ? picUrl + suffix : picUrl;
    try {
      const args = [
        "-s", "-L",
        "--max-time", "20",
        "-H", `Referer: https://www.bilibili.com/`,
      ];
      if (proxy) args.push("-x", proxy);
      args.push(url);

      const buf = execFileSync("curl", args, {
        timeout: 25000,
        maxBuffer: 20 * 1024 * 1024,
        encoding: "buffer",
      });

      if (!buf || buf.length < 1024) continue;

      // 验证是否为有效图片（检查 magic bytes）
      const header = buf.slice(0, 4).toString("hex");
      const isJpeg = header.startsWith("ffd8");
      const isPng = header === "89504e47";
      const isWebp = header === "52494646"; // RIFF (WebP wraps in RIFF)
      if (!isJpeg && !isPng && !isWebp) continue;

      const ext = isPng ? "png" : isWebp ? "webp" : "jpg";
      const dims = isJpeg ? parseJpegDimensions(buf) : null;
      return { buffer: buf, suffix, ext, dims };
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * 解析 JPEG 尺寸（仅 JPEG 需要，PNG/WebP 直接用原图）
 */
function parseJpegDimensions(buf) {
  let i = 0;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
    } else if (marker === 0x00) {
      i += 1;
    } else {
      const segLen = buf.readUInt16BE(i + 2);
      i += 2 + segLen;
    }
  }
  return null;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(1) + " KB";
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("用法: node bili-thumb.js <bilibili-url-or-video-id>");
    console.error("");
    console.error("支持的格式:");
    console.error("  https://www.bilibili.com/video/BVxxxxxxxxxx");
    console.error("  https://b23.tv/xxxxx");
    console.error("  BVxxxxxxxxxx（纯 BV 号）");
    console.error("  av123456（纯 AV 号）");
    console.error("");
    console.error("代理: 设置 HTTPS_PROXY 环境变量（如 http://127.0.0.1:7890）");
    process.exit(1);
  }

  let videoId = extractVideoId(input);
  if (!videoId) {
    console.error("错误: 无法从输入中提取视频 ID。");
    console.error("支持: bilibili.com/video/BV..., b23.tv/..., BV号, AV号");
    process.exit(1);
  }

  const proxy = getProxyUrl();
  const via = proxy ? ` via proxy ${proxy}` : " (直连)";

  // 解析短链接
  if (videoId.shortlink) {
    console.log(`正在解析短链接: ${videoId.shortlink} ...`);
    videoId = resolveShortLink(videoId.shortlink, proxy);
    if (!videoId) {
      console.error("错误: 无法解析短链接，请尝试直接提供 BV 号。");
      process.exit(1);
    }
    console.log(`  解析结果: ${videoId.bvid || videoId.aid}`);
  }

  const displayId = videoId.bvid || `av${videoId.aid}`;
  console.log(`正在获取视频信息: ${displayId}${via} ...`);

  let videoInfo;
  try {
    videoInfo = getVideoInfo(videoId, proxy);
  } catch (err) {
    console.error(`获取视频信息失败: ${err.message}`);
    if (!proxy) {
      console.error("提示: 如果你需要通过代理访问，请设置 HTTPS_PROXY 环境变量。");
    }
    process.exit(1);
  }

  const displayIdFinal = videoInfo.bvid || `av${videoInfo.aid}`;
  console.log(`  标题: ${videoInfo.title}`);
  console.log(`   UP主: ${videoInfo.owner?.name || "未知"}`);
  console.log(`  封面: ${videoInfo.pic}`);

  console.log(`正在下载封面...`);
  const result = await downloadCover(videoInfo.pic, proxy);
  if (!result) {
    console.error("错误: 封面下载失败，所有分辨率均不可用。");
    process.exit(1);
  }

  const outDir = path.join("output", displayIdFinal);
  fs.mkdirSync(outDir, { recursive: true });

  const suffixLabel = result.suffix ? result.suffix.replace(/^@/, "_").replace(/[wh]/g, "") : "_original";
  const fileName = `thumbnail${suffixLabel}.${result.ext}`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, result.buffer);

  const sizeStr = formatSize(result.buffer.length);
  const dimStr = result.dims ? `${result.dims.width}x${result.dims.height}` : (result.suffix ? result.suffix.replace(/^@/, "").replace("h", "x").replace("w", "") : "原图");

  console.log(`\n✓ 封面已保存: ${filePath}`);
  console.log(`  分辨率: ${dimStr} | 大小: ${sizeStr} | BV号: ${displayIdFinal}`);
}

main().catch((err) => {
  console.error("未知错误:", err.message);
  process.exit(1);
});