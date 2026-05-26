# excellent-thumbnail-maker

> Bilibili 视频封面采集 + AI 微调提示词生成工具

**Claude Code Skill** — 输入 Bilibili 链接或话题关键词，自动下载封面、分析视觉构成、生成可直接用于即梦/通义的 AI 图片编辑微调指令。

---

## 功能亮点

- **直接模式**：给个 Bilibili 链接或 BV 号，直接下载封面并分析
- **发现模式**：输入话题，自动搜索 B 站相关热门视频，按播放量 + 相关度排序选出 Top 5，选完再分析
- **智能视觉分析**：文字、色彩、布局、图标、人物、风格 6 个维度逐项拆解
- **微调提示词**：生成的不是"重新设计"，而是具体的局部编辑指令（换文字、调颜色、替元素），可直接粘贴到 AI 图片编辑工具
- **人物替换感知**：如果封面有人物，自动在提示词首条生成人物替换指令
- **B 站特色识别**：额外分析二次元风格、弹幕文化等 B 站特色视觉元素

## 使用方式

在 Claude Code 中触发：

```
封面采集 https://www.bilibili.com/video/BV1xx411c7mD
```

或用发现模式搜索：

```
搜索视频 AI 设计教程
```

**触发词**：封面采集、B站封面、bilibili封面、视频封面、thumbnail、找视频、封面发现

## 工作流程

```
输入判断 ──┬── Bilibili 链接 → 直接下载封面
           └── 话题关键词 → 搜索 Top 5 → 用户选择 → 下载封面
                                    ↓
                            视觉分析（6 维度）
                                    ↓
                         生成 3-5 条微调提示词
                                    ↓
                        输出报告到 output/{bvid}/
```

## 支持的链接格式

| 格式 | 示例 |
|------|------|
| 完整链接 | `https://www.bilibili.com/video/BV1xx411c7mD` |
| AV 号链接 | `https://www.bilibili.com/video/av170001` |
| 短链接 | `https://b23.tv/xxxxx` |
| 纯 BV 号 | `BV1xx411c7mD` |
| 纯 AV 号 | `av170001` |

## 输出示例

```
output/BV1xx411c7mD/
├── thumbnail_original.jpg          # 封面图片（最高可用分辨率）
└── cover-analysis.md               # 分析报告 + 微调提示词
```

报告内容包含：

| 模块 | 内容 |
|------|------|
| 基本信息 | BV 号、封面路径、分辨率、文件大小 |
| 视觉分析 | 文字、色彩、布局、图标、人物、风格 6 维度 |
| 微调提示词 | 3-5 条 `[类别] 具体编辑指令`，可直接粘贴到即梦/通义 |

## 文件结构

```
excellent-thumbnail-maker/
├── SKILL.md                # 主指令文件（Skill 定义）
├── README.md               # 本文件
├── scripts/
│   └── bili-thumb.js       # 封面下载脚本（Node.js，依赖 curl）
└── assets/
    └── output-template.md  # 分析报告输出模板
```

## 依赖

- **Node.js** — 运行封面下载脚本
- **curl** — 实际下载封面图片（脚本通过 `child_process.execFileSync` 调用）

### 网络说明

- Bilibili 在中国大陆可直接访问，脚本默认直连
- 如需通过代理（如海外访问或特殊网络环境），设置 `HTTPS_PROXY` 环境变量：

```bash
HTTPS_PROXY=http://127.0.0.1:7890 node scripts/bili-thumb.js "BV1xx411c7mD"
```

## 安装到 Claude Code

将整个 `excellent-thumbnail-maker/` 目录复制到项目的 `.claude/skills/` 下即可：

```bash
cp -r excellent-thumbnail-maker/ your-project/.claude/skills/
```

无需额外安装步骤，Claude Code 会自动识别 `.claude/skills/` 下的 Skill。

## 被其他 Skill 调用

支持结构化输入：

```json
// 直接模式
{ "url": "Bilibili 视频链接或 BV 号", "focus": "配色" }

// 发现模式
{ "topic": "搜索话题", "max_results": 10 }
```

## License

MIT