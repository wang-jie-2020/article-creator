---
name: excellent-thumbnail-maker
description: >-
  Bilibili 视频封面采集 + AI 微调提示词生成工具。支持两种模式：
  1) 直接模式：输入 Bilibili 链接，下载封面并分析；
  2) 发现模式：输入话题，自动搜索相关热门视频，用户选择后再下载分析。
  触发词：封面采集、B站封面、bilibili封面、视频封面、采集封面、thumbnail、
  找视频、搜索视频、封面发现。
  输出到 output/{videoId}/ 目录。
license: MIT
metadata:
  author: mav-content-fac
  version: 3.0.0
  created: 2026-04-21
  updated: 2026-05-26
  dependencies:
    - url: ./scripts/bili-thumb.js
      name: bili-thumb.js
      type: script
---

# /bili-thumb-skill — Bilibili 封面采集 + 微调提示词

采集 Bilibili 视频封面，分析视觉构成，生成 AI 图片编辑微调指令。

## 触发词

- "封面采集"
- "B站封面"
- "bilibili封面"
- "视频封面"
- "采集封面"
- "thumbnail"
- "找视频"
- "搜索视频"
- "封面发现"

---

## 工作流程

### Phase 1: 接收输入

判断用户输入类型，分三种情况：

**情况 A — 用户提供了 Bilibili 链接**：
直接跳到 Phase 3（下载封面），跳过搜索阶段。

支持的链接格式：
- `https://www.bilibili.com/video/BVxxxxxxxxxx`（BV 号，12 位，BV 开头）
- `https://www.bilibili.com/video/av123456`（AV 号）
- `https://b23.tv/xxxxx`（短链接）
- 纯 BV 号（如 `BV1xx411c7mD`）
- 纯 AV 号（如 `av170001`）

**情况 B — 用户提供了话题/主题（无链接）**：
进入 Phase 2（发现模式），搜索相关视频。

**情况 C — 用户未提供任何输入**：
询问用户：
> "你想分析哪个视频的封面？可以：
> 1. 直接给我 Bilibili 链接
> 2. 告诉我你感兴趣的话题，我帮你找相关热门视频"

---

### Phase 2: 发现模式（仅情况 B 触发）

#### 2.1 搜索 Bilibili 视频

**优先使用 Bilibili 搜索 API**（返回 JSON，解析方便）。

**搜索步骤**：

1. 将用户话题作为关键词，中文搜索为主，必要时中英文各搜一轮合并去重
2. 调用 Bilibili 搜索 API：
   ```
   URL: https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={url_encoded_query}&page=1
   Headers: User-Agent: Mozilla/5.0 ..., Referer: https://www.bilibili.com/
   ```
3. **如果 API 失败**，回退到 WebFetch 抓取 Bilibili 搜索页：
   ```
   URL: https://search.bilibili.com/all?keyword={url_encoded_query}
   ```
4. 如仍失败，使用 WebSearch 搜索 `site:bilibili.com {关键词}`

**从 API 响应中提取**（每个视频在 `data.result[]` 中）：
- `title` — 视频标题
- `author` — UP 主名称
- `play` — 播放量（API 直接返回数字，无需解析 K/M）
- `bvid` — BV 号
- `pic` — 封面图片 URL

**播放量处理**：
- Bilibili API 返回的 `play` 字段已经是数字，直接使用
- 如果通过网页解析，Bilibili 的播放量格式：`1.2万` = 12000，`100万` = 1000000

#### 2.2 筛选与排序

从所有搜索结果中，按以下公式评分后选出 **Top 5**：

**评分公式**：`总分 = 播放量分 × 0.8 + 相似度分 × 0.2`

- **播放量分**（0-100）：在所有结果中归一化，最高播放量 = 100 分
- **相似度分**（0-100）：标题与用户话题的语义相关度。标准放宽——只要标题中包含用户话题的关键词、同义词、或所属领域即可得分

**排序规则**：按总分从高到低排列，取前 5 个。如果搜索结果不足 5 个，全部展示。

#### 2.3 结果展示（确认点 #1）

向用户展示 **5 条**精选结果：

```markdown
## 精选视频：{话题}

> 筛选依据：播放量 80% + 话题相关度 20%

| 序号 | 视频标题 | UP主 | 播放量 | 链接 |
|------|---------|------|--------|------|
| 1 | {标题} | {UP主} | {播放量} | [链接](https://www.bilibili.com/video/{bvid}) |
| 2 | {标题} | {UP主} | {播放量} | [链接](https://www.bilibili.com/video/{bvid}) |
| ... | ... | ... | ... | ... |
```

**必须等待用户选择后才能继续。** 用户可输入序号选择一个或多个（如 "1,3,5"）。

#### 2.4 无结果处理

如果搜索没有返回有效的 Bilibili 视频：
- 尝试更宽泛的搜索词
- 如仍无结果，提示用户直接提供 Bilibili 链接

---

### Phase 3: 下载封面

运行下载脚本：

```bash
node .claude/skills/excellent-thumbnail-maker/scripts/bili-thumb.js "<URL或BV号>"
```

**代理说明**：
- Bilibili 在中国大陆可直接访问，默认直连
- 如需代理，设置 `HTTPS_PROXY` 环境变量，脚本自动使用：
  ```bash
  HTTPS_PROXY=http://127.0.0.1:7890 node .claude/skills/excellent-thumbnail-maker/scripts/bili-thumb.js "<URL>"
  ```

**失败处理**：
- 网络超时 → 提示用户检查网络连接
- 视频不存在（API code != 0）→ 提示用户检查链接是否正确
- 短链接无法解析 → 提示用户直接提供 BV 号
- 封面下载失败 → 提示视频可能已删除或设为私密

**成功后**：记录文件路径（`output/{bv号}/thumbnail_*.jpg`）、分辨率、文件大小。

**多视频处理**：如果用户在发现模式中选择了多个视频，逐个执行 Phase 3-6，每个视频独立输出到 `output/{bvid}/`。每完成一个视频，展示摘要后再处理下一个。

---

### Phase 4: 分析封面

用 Read 工具读取下载的封面图片（Claude 可直接查看图片）。

**视觉分析维度**：

| 维度 | 分析要点 |
|------|---------|
| 文字内容 | 标题/副标题的文字、语言、字体大小、颜色、位置 |
| 色彩构成 | 主色调、辅助色、背景色、对比度 |
| 布局结构 | 元素分布（左/中/右）、视觉重心、留白区域 |
| 图标/图形 | 图标数量、位置、风格（扁平/3D/拟物） |
| 人物/照片 | 是否有人物、表情、姿态、占比 |
| 整体风格 | 科技感/温馨/极简/商务/趣味/二次元/B站风格等 |

---

### Phase 5: 生成微调提示词

基于 Phase 4 的分析，生成 **3-5 条微调指令**。

**核心原则：微调，不是重做**。每条指令是即梦/通义等 AI 图片编辑工具可直接使用的编辑指令。

**人物替换规则**：
如果封面图中包含人物（真人、卡通人物、二次元角色），**必须在提示词列表第一条**添加：
```
[元素替换] 把人物替换成"图2"，保持原有位置、大小和姿态不变
```
用户会在生图平台自行上传"图2"作为参考图。此规则优先级最高，不可省略。

**提示词分类与示例**：

| 类别 | 好的微调示例 |
|------|-------------|
| 文字修改 | "将图中大标题文字改为'AI入门指南'，保持原有字体风格" |
| 颜色调整 | "将背景色从深蓝色改为深紫色渐变" |
| 布局微调 | "将右侧两个图标交换上下位置" |
| 视觉增强 | "给标题文字添加白色描边效果，提升可读性" |
| 元素替换 | "将左下角的手机图标替换为笔记本电脑图标" |

**反面示例（不要这样写）**：
- ~~"重新设计一个全新的封面"~~ → 太大改动
- ~~"让封面更好看"~~ → 不具体
- ~~"参考苹果发布会风格"~~ → 是重做不是微调

**每条提示词格式**：
```
[类别] 具体的编辑指令
```

---

### Phase 6: 输出

将结果写入 `output/{bvid}/cover-analysis.md`，使用 `assets/output-template.md` 模板。

同时在终端展示摘要。

---

## 被其他 Skill 调用

当被其他 skill 串联调用时：

**直接模式**：
```json
{
  "url": "Bilibili 视频链接或 BV 号",
  "focus": "可选，指定关注的分析维度（如 '文字'、'配色')"
}
```

**发现模式**：
```json
{
  "topic": "搜索话题",
  "max_results": 10
}
```

**输出**：
- 封面图片路径
- 微调提示词列表
- 视觉分析摘要