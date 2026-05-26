# mermaid-diagram-v2

> 参数化 Mermaid 图解生成器

**Claude Code Skill** — 给个话题或一段文章，自动调研/分析后生成风格可控的 Mermaid 图解。5 个参数精准控制输出：生成数量、炫酷程度、简洁程度、配色方案、目标受众。

---

## 功能亮点

- **两种输入模式**：调研模式（多平台搜索扒一圈再画）和文本模式（分析已有文章/段落直接画）
- **5 个可调参数**，从数量到风格全面控制输出
- **双确认机制**：方案确认 + ASCII 骨架预览，生成前有两次人工检查点
- **叙事连贯**：多张图解之间有逻辑递进，不是孤立的图表堆砌
- **语法验证**：生成后自动检查 Mermaid 语法合法性、节点引用、配色一致性

## 使用方式

在 Claude Code 中触发：

```
画个图 AI Agent 的工作原理
```

或指定文本：

```
把这段话画出来：{粘贴你的文章/笔记}
```

**触发词**：画图、mermaid、图解、可视化、示意图、流程图、思维导图、文本图解、文章图解、把这段话画出来

## 五个可调参数

| 参数 | 选项 | 默认 |
|------|------|------|
| **生成数量** | 精简(0-6) / 标准(6-10) / 详细(10-15) / 超详细(15+) | 标准 |
| **炫酷程度** | L1 纯文字 / L2 活人感 / L3 中等 / L4 炫酷 | L2 |
| **简洁程度** | 低(<20字) / 中(20-40字) / 高(40+字) | 中 |
| **配色方案** | 暖色系 / 冷色系 / 彩虹渐变 / 黑白极简 | 暖色系 |
| **目标受众** | 入门 / 进阶 / 专业 | 进阶 |

不知道怎么选？直接回复"默认"即可。

## 工作流程

```
模式选择 ──┬── 调研模式 → 跨平台搜索（Twitter/知乎/YouTube/小红书/Google）
           └── 文本模式 → 文本结构分析 + 概念提取
                                    ↓
                         参数收集（5 个参数）
                                    ↓
                         概念提取与结构化
                                    ↓
                    ┌── 确认点 #1：图解方案（画什么、怎么画）
                    │
                    ├── 确认点 #2：ASCII 骨架预览
                    │
                    └── 生成 Mermaid 代码 + 语法验证
                                    ↓
                      输出到 output/{topic}/diagrams/
```

## 输出示例

```
output/{topic}/diagrams/
└── diagrams.md    # 完整图解文件（首页 + N 张 Mermaid 图）
```

文件头部包含参数信息的 HTML 注释，每张图之间有承上启下的说明文字。

## 文件结构

```
mermaid-diagram-v2/
├── SKILL.md                          # 主指令文件（Skill 定义）
├── README.md                         # 本文件
├── references/
│   ├── mermaid-style-guide.md        # 参数到 Mermaid 的完整映射规则、配色 hex 值
│   ├── diagram-patterns.md           # 图表类型语法模板、节点形状、连接线样式
│   ├── research-guide.md             # 调研方法论（调研模式）
│   └── text-analysis-guide.md        # 文本分析方法论（文本模式）
└── assets/
    └── output-template.md            # 输出文件格式模板
```

## 安装到 Claude Code

将整个 `mermaid-diagram-v2/` 目录复制到项目的 `.claude/skills/` 下即可：

```bash
cp -r mermaid-diagram-v2/ your-project/.claude/skills/
```

无需额外安装步骤，Claude Code 会自动识别 `.claude/skills/` 下的 Skill。

## License

MIT
