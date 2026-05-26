const pptxgen = require("pptxgenjs");

// ── Color palette (no # prefix!) ──
const C = {
  darkBg: "1A1A2E",
  darkBg2: "16213E",
  lightBg: "FAFAF8",
  warmBg: "F5F3F0",
  textPrimary: "1A1A1A",
  textSecondary: "666666",
  textTertiary: "999999",
  textOnDark: "FFFFFF",
  textOnDarkMuted: "A0A0B0",
  border: "E5E5E3",
  cardBg: "FFFFFF",
  pink: "FF6B9D",
  orange: "FF7A45",
  green: "52C41A",
  purple: "722ED1",
  blue: "1890FF",
  cyan: "13C2C2",
};

// ── Factory functions to avoid option-object reuse pitfall ──
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 });
const makeCardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.1 });

// ── Helpers ──
function addSlideNumber(slide, num, total, isDark) {
  slide.addText(`${num} / ${total}`, {
    x: 8.8, y: 5.15, w: 1, h: 0.35,
    fontSize: 8, fontFace: "Inter", color: isDark ? C.textOnDarkMuted : C.textTertiary,
    align: "right", margin: 0,
  });
}

function addSectionLabel(slide, text, isDark) {
  slide.addText(text, {
    x: 0.6, y: 0.3, w: 5, h: 0.3,
    fontSize: 8, fontFace: "Consolas", color: isDark ? C.textOnDarkMuted : C.textTertiary,
    charSpacing: 3, align: "left", margin: 0,
  });
}

function addWarmCircle(slide, x, y, size, opacity) {
  slide.addShape("ellipse", {
    x, y, w: size, h: size,
    fill: { color: "F5EBE0", transparency: 100 - (opacity || 20) },
  });
}

// ── Main ──
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Vibe Coding Guide";
  pres.title = "五个概念，看懂 Vibe Coding 是怎么运转的";
  const TOTAL = 13;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 1: TITLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };
    // Subtle gradient-like shapes
    s.addShape("ellipse", { x: 7.5, y: -1.5, w: 4.5, h: 4.5, fill: { color: C.pink, transparency: 92 } });
    s.addShape("ellipse", { x: -1.5, y: 3, w: 4, h: 4, fill: { color: C.blue, transparency: 92 } });

    s.addText("VIBE CODING 入门指南", {
      x: 0.7, y: 0.6, w: 5, h: 0.3,
      fontSize: 8, fontFace: "Consolas", color: C.textOnDarkMuted, charSpacing: 4, margin: 0,
    });
    s.addText([
      { text: "五个概念，", options: { fontSize: 52, fontFace: "Arial Black", color: C.textOnDark, bold: true, breakLine: true } },
      { text: "看懂 Vibe Coding ", options: { fontSize: 52, fontFace: "Arial Black", color: C.textOnDark, bold: true, breakLine: true } },
      { text: "是怎么运转的", options: { fontSize: 52, fontFace: "Arial Black", color: C.textOnDark, bold: true } },
    ], { x: 0.7, y: 1.2, w: 8.5, h: 2.8, valign: "top", margin: 0 });

    // Divider line
    s.addShape("line", { x: 0.7, y: 4.15, w: 0.8, h: 0, line: { color: C.pink, width: 2 } });

    s.addText("Subagent  ·  Hooks  ·  MCP  ·  Skill  ·  Claude.md", {
      x: 0.7, y: 4.3, w: 8, h: 0.35,
      fontSize: 11, fontFace: "Consolas", color: C.textOnDarkMuted, charSpacing: 2, margin: 0,
    });
    s.addText("用最直白的比喻，理解 AI 协作系统的五个核心概念，以及它们如何拼成一套完整的工作台。", {
      x: 0.7, y: 4.7, w: 6.5, h: 0.35,
      fontSize: 10, fontFace: "Calibri", color: C.textOnDarkMuted, margin: 0,
    });
    addSlideNumber(s, 1, TOTAL, true);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 2: THE PHENOMENON
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };
    addWarmCircle(s, 8, 3.5, 3.5, 12);
    addSectionLabel(s, "你大概已经见过了", false);

    s.addText([
      { text: "打字就能出网站", options: { fontSize: 40, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "这不是魔术", options: { fontSize: 40, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.75, w: 8, h: 1.6, margin: 0 });

    // Quote block
    s.addShape("rectangle", { x: 0.6, y: 2.55, w: 0.06, h: 1.0, fill: { color: C.textPrimary } });
    s.addText([
      { text: "有人在编辑器里打一段中文，AI 自动生成整套代码，一个按钮，网站就上线了。", options: { fontSize: 14, fontFace: "Calibri", color: C.textSecondary, breakLine: true } },
      { text: "你不用写代码，你只需要描述你想要什么。", options: { fontSize: 14, fontFace: "Calibri", color: C.textPrimary, bold: true } },
    ], { x: 0.9, y: 2.55, w: 7.5, h: 1.0, margin: 0 });

    s.addText("Vibe Coding 真正高效的人，都在用五个核心概念搭建自己的\"AI 工作台\"。这篇文章不会教你写一行代码——只用最直白的比喻带你理解它们。", {
      x: 0.6, y: 3.8, w: 8, h: 0.7,
      fontSize: 12, fontFace: "Calibri", color: C.textSecondary, margin: 0,
    });
    addSlideNumber(s, 2, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 3: THE PROBLEM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.warmBg };
    addSectionLabel(s, "为什么需要这套体系", false);

    s.addText([
      { text: "只用基础对话", options: { fontSize: 40, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "你很快就会撞到天花板", options: { fontSize: 40, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.75, w: 8.5, h: 1.6, margin: 0 });

    // Pain points card
    s.addShape("rectangle", { x: 0.6, y: 2.6, w: 5.5, h: 1.7, fill: { color: C.cardBg }, shadow: makeCardShadow() });
    const painItems = [
      { text: "上下文太长，AI 开始\"忘记\"你最早说过的话", options: { fontSize: 12, fontFace: "Calibri", color: C.textSecondary, bullet: true, breakLine: true } },
      { text: "每次新对话都要重新介绍项目背景和规则", options: { fontSize: 12, fontFace: "Calibri", color: C.textSecondary, bullet: true, breakLine: true } },
      { text: "手动复制粘贴数据，重复描述同一种工作流程", options: { fontSize: 12, fontFace: "Calibri", color: C.textSecondary, bullet: true } },
    ];
    s.addText(painItems, { x: 0.9, y: 2.75, w: 5, h: 1.4, margin: 0 });

    // Five concepts callout
    s.addText([
      { text: "五个核心概念：", options: { fontSize: 12, fontFace: "Calibri", color: C.textPrimary, bold: true } },
      { text: "Subagent", options: { fontSize: 12, fontFace: "Calibri", color: C.pink, bold: true } },
      { text: " · ", options: { fontSize: 12, fontFace: "Calibri", color: C.textTertiary } },
      { text: "Hooks", options: { fontSize: 12, fontFace: "Calibri", color: C.orange, bold: true } },
      { text: " · ", options: { fontSize: 12, fontFace: "Calibri", color: C.textTertiary } },
      { text: "MCP", options: { fontSize: 12, fontFace: "Calibri", color: C.green, bold: true } },
      { text: " · ", options: { fontSize: 12, fontFace: "Calibri", color: C.textTertiary } },
      { text: "Skill", options: { fontSize: 12, fontFace: "Calibri", color: C.purple, bold: true } },
      { text: " · ", options: { fontSize: 12, fontFace: "Calibri", color: C.textTertiary } },
      { text: "Claude.md", options: { fontSize: 12, fontFace: "Calibri", color: C.blue, bold: true } },
    ], { x: 0.6, y: 4.5, w: 8.5, h: 0.4, margin: 0 });
    addSlideNumber(s, 3, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 4: FIVE CONCEPTS OVERVIEW
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };
    addSectionLabel(s, "先认识这五个概念", false);

    s.addText([
      { text: "五个关键词，", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "一句话就能讲明白", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.7, w: 8, h: 1.4, margin: 0 });

    // 5 concept cards in a row
    const cards = [
      { name: "Subagent", analogy: "主编把活外包给实习生团队——并行处理，各自汇报", tag: "子代理", color: C.pink },
      { name: "Hooks", analogy: "自动驾驶的传感器——检测到事件自动执行动作", tag: "钩子", color: C.orange },
      { name: "MCP", analogy: "USB-C 万能转接头——一个标准接口连接所有外部工具", tag: "协议", color: C.green },
      { name: "Skill", analogy: "预制菜操作说明书——加载即用，不重新发明菜谱", tag: "技能", color: C.purple },
      { name: "Claude.md", analogy: "贴在墙上的员工守则——不用每天重申的规则书", tag: "规则文件", color: C.blue },
    ];

    cards.forEach((c, i) => {
      const cx = 0.25 + i * 1.92;
      // Card bg
      s.addShape("rectangle", { x: cx, y: 2.3, w: 1.78, h: 2.3, fill: { color: C.cardBg }, shadow: makeShadow() });
      // Color accent top bar
      s.addShape("rectangle", { x: cx, y: 2.3, w: 1.78, h: 0.06, fill: { color: c.color } });
      // Name
      s.addText(c.name, { x: cx + 0.15, y: 2.5, w: 1.48, h: 0.35, fontSize: 13, fontFace: "Arial Black", color: C.textPrimary, bold: true, margin: 0 });
      // Analogy
      s.addText(c.analogy, { x: cx + 0.15, y: 2.9, w: 1.48, h: 1.0, fontSize: 9, fontFace: "Calibri", color: C.textSecondary, margin: 0, valign: "top" });
      // Tag
      s.addShape("rectangle", { x: cx + 0.15, y: 4.05, w: 0.7, h: 0.28, fill: { color: c.color, transparency: 85 } });
      s.addText(c.tag, { x: cx + 0.15, y: 4.05, w: 0.7, h: 0.28, fontSize: 7, fontFace: "Calibri", color: c.color, align: "center", valign: "middle", margin: 0 });
    });
    addSlideNumber(s, 4, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDES 5-9: Each concept detail
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const conceptDetails = [
    {
      num: "01", name: "Subagent", tagline: "主编的实习生团队",
      color: C.pink, bg: C.warmBg,
      quote: "你拿到一个选题，不是从头写到尾——把\"查资料\"派给实习生 A，\"整理数据\"派给实习生 B，\"找案例\"派给实习生 C。每个人只干一件事，干完汇报。你汇总、审核、成稿。",
      explain: "AI 在后台生成多个子代理，它们同时跑、互不干扰、并行加速。单个 AI 的\"注意力\"有限，Subagent 把大任务拆碎，每个小任务在干净的上下文里独立完成。",
      extra: null,
    },
    {
      num: "02", name: "Hooks", tagline: "自动驾驶的传感器",
      color: C.orange, bg: C.lightBg,
      quote: "出门前\"门一关\"这个动作，自动触发\"检查钥匙带没带\"——不需要你每次手动提醒自己。Hooks 就是 AI 工作流里的这个自动触发机制。",
      explain: null,
      extra: [
        { label: "发消息前", desc: "自动检查有没有粘贴了 API 密钥" },
        { label: "编辑文件后", desc: "自动运行代码格式化" },
        { label: "会话结束后", desc: "自动记录文件版本信息" },
      ],
    },
    {
      num: "03", name: "MCP", tagline: "USB-C 万能转接头",
      color: C.green, bg: C.warmBg,
      quote: "没有 MCP 之前：让 AI 查数据库、发 Slack、看 GitHub——每一项都要写一套定制代码，像每次出国要带不同转换插头。有了 MCP 之后：一个标准协议，所有工具即插即用。",
      explain: "把 AI 想象成一位盲人 CEO。他对讲机（MCP）可以命令不同部门（MCP Server）替他干活。Vibe Coding 的核心是\"用自然语言驱动一切\"——MCP 让这件事在技术上成为可能。",
      extra: null,
    },
    {
      num: "04", name: "Skill", tagline: "预制菜操作说明书",
      color: C.purple, bg: C.lightBg,
      quote: "你是导演，摄像师需要一份\"拍摄手册\"。你喊一句\"拍街头风格\"，他就自动按手册调好参数开始工作。不需要每次从头教光圈、构图、色调。",
      explain: "每个 Skill 是一组\"提示词 + 规则 + 参考材料\"的打包。调用 skill 时，AI 被注入完整方法论。写代码、写文章、画图表、做 PPT、审查代码安全——任何需要反复执行且有固定方法论的任务，都可以封装成 skill。",
      extra: null,
    },
    {
      num: "05", name: "Claude.md", tagline: "贴在墙上的员工守则",
      color: C.blue, bg: C.warmBg,
      quote: "你开了一家餐厅。Claude.md 不是你每天给厨师的\"今天做什么菜\"菜单——它是贴在厨房墙上的食品安全条例和出品标准。不用每天重读，但它永远在那里生效。",
      explain: "没有 Claude.md：每次打开 AI，先花 5-10 分钟介绍自己、介绍项目。AI 像第一天入职的新同事。有 Claude.md：AI 在对话开始前被\"预加载\"了关于你的一切。消除每一次对话的冷启动成本。",
      extra: null,
    },
  ];

  conceptDetails.forEach((cd) => {
    const s = pres.addSlide();
    s.background = { color: cd.bg };
    addSectionLabel(s, `概念 ${cd.num}`, false);

    // Title + tagline
    s.addText([
      { text: cd.name, options: { fontSize: 44, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
      { text: `  ${cd.tagline}`, options: { fontSize: 26, fontFace: "Arial Black", color: cd.color, bold: false } },
    ], { x: 0.6, y: 0.7, w: 9, h: 0.8, margin: 0 });

    // Quote block
    s.addShape("rectangle", { x: 0.6, y: 1.75, w: 0.06, h: 1.1, fill: { color: cd.color } });
    s.addText(cd.quote, {
      x: 0.9, y: 1.75, w: 8, h: 1.1, fontSize: 13, fontFace: "Calibri", color: C.textSecondary, margin: 0,
    });

    // Explanation or extra content
    if (cd.explain) {
      s.addText(cd.explain, {
        x: 0.6, y: 3.1, w: 8.5, h: 0.9, fontSize: 12, fontFace: "Calibri", color: C.textSecondary, margin: 0,
      });
    }

    if (cd.extra) {
      // Card with examples
      s.addShape("rectangle", { x: 0.6, y: 3.1, w: 6, h: 1.5, fill: { color: C.cardBg }, shadow: makeCardShadow() });
      cd.extra.forEach((ex, i) => {
        const ey = 3.2 + i * 0.48;
        s.addText([
          { text: ex.label, options: { fontSize: 11, fontFace: "Calibri", color: C.textPrimary, bold: true } },
          { text: ` — ${ex.desc}`, options: { fontSize: 11, fontFace: "Calibri", color: C.textSecondary } },
        ], { x: 0.9, y: ey, w: 5.5, h: 0.4, margin: 0, valign: "middle" });
      });
    }

    addSlideNumber(s, 5 + conceptDetails.indexOf(cd), TOTAL, false);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 10: HOW THEY WORK TOGETHER — PIPELINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };
    addSectionLabel(s, "拼在一起", false);

    s.addText([
      { text: "五个概念", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "怎样配合完成一整套工作", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.7, w: 8, h: 1.4, margin: 0 });

    s.addText("场景：你要做一个个人博客网站，从零到上线。", {
      x: 0.6, y: 2.1, w: 8, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.textSecondary, margin: 0,
    });

    // 5 pipeline steps
    const steps = [
      { num: "Step 1", name: "Claude.md", role: "定义游戏规则：你是谁、偏好什么风格、什么不能做", color: C.blue },
      { num: "Step 2", name: "Skill", role: "加载前端设计方法论，AI 获得专业能力", color: C.purple },
      { num: "Step 3", name: "MCP", role: "连接 GitHub 取旧数据，连接 Vercel 部署上线", color: C.green },
      { num: "Step 4", name: "Hooks", role: "自动格式化代码、扫描密钥泄露、记录日志", color: C.orange },
      { num: "Step 5", name: "Subagent", role: "并行处理：设计方案 / 写文案 / SEO 元数据", color: C.pink },
    ];

    steps.forEach((st, i) => {
      const px = 0.2 + i * 1.94;
      // Card
      s.addShape("rectangle", { x: px, y: 2.55, w: 1.78, h: 1.9, fill: { color: C.cardBg }, shadow: makeShadow() });
      // Top accent
      s.addShape("rectangle", { x: px, y: 2.55, w: 1.78, h: 0.06, fill: { color: st.color } });
      // Step num
      s.addText(st.num, { x: px + 0.12, y: 2.7, w: 1.54, h: 0.25, fontSize: 7, fontFace: "Consolas", color: C.textTertiary, charSpacing: 2, margin: 0 });
      // Name
      s.addText(st.name, { x: px + 0.12, y: 2.9, w: 1.54, h: 0.35, fontSize: 13, fontFace: "Arial Black", color: C.textPrimary, bold: true, margin: 0 });
      // Role
      s.addText(st.role, { x: px + 0.12, y: 3.3, w: 1.54, h: 0.9, fontSize: 9, fontFace: "Calibri", color: C.textSecondary, margin: 0, valign: "top" });
      // Arrow between cards
      if (i < steps.length - 1) {
        s.addText("▸", { x: px + 1.78, y: 3.25, w: 0.16, h: 0.4, fontSize: 14, color: C.border, align: "center", valign: "middle", margin: 0 });
      }
    });

    addSlideNumber(s, 10, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 11: THE COMPLETE SYSTEM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.warmBg };
    addSectionLabel(s, "最终效果", false);

    s.addText([
      { text: "你感觉只是在聊天，", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "但背后是一整条生产线", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.7, w: 8.5, h: 1.4, margin: 0 });

    // Card
    s.addShape("rectangle", { x: 0.6, y: 2.35, w: 6.8, h: 2.3, fill: { color: C.cardBg }, shadow: makeCardShadow() });

    // Flow line
    const flowColors = [C.blue, C.purple, C.green, C.orange, C.pink];
    const flowNames = ["Claude.md", "Skill", "MCP", "Hooks", "Subagent"];
    const flowArrows = ["设规则", "装能力", "连外部", "自动守护", "并行执行"];
    flowNames.forEach((name, i) => {
      const fx = 0.95 + i * 1.28;
      s.addText([
        { text: name, options: { fontSize: 11, fontFace: "Arial Black", color: flowColors[i], bold: true } },
        { text: ` → ${flowArrows[i]}`, options: { fontSize: 10, fontFace: "Calibri", color: C.textSecondary } },
      ], { x: fx, y: 2.55, w: 1.2, h: 0.35, margin: 0 });
    });

    // Divider
    s.addShape("line", { x: 0.95, y: 3.15, w: 6, h: 0, line: { color: C.border, width: 0.5 } });

    s.addText("五样东西各司其职，组合成一套不需要写代码的\"软件生产流水线\"。你不是在操作机器，你是在管理一支 AI 团队。", {
      x: 0.95, y: 3.3, w: 6.1, h: 0.8, fontSize: 12, fontFace: "Calibri", color: C.textSecondary, margin: 0,
    });

    addSlideNumber(s, 11, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 12: SUMMARY TABLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.lightBg };
    addSectionLabel(s, "人话总结", false);

    s.addText([
      { text: "你只需要记住", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true, breakLine: true } },
      { text: "这几个类比", options: { fontSize: 36, fontFace: "Arial Black", color: C.textPrimary, bold: true } },
    ], { x: 0.6, y: 0.7, w: 8, h: 1.4, margin: 0 });

    // Summary table
    const summaryRows = [
      { name: "Claude.md", desc: "贴在墙上的员工守则，不用每天重申", color: C.blue },
      { name: "Skill", desc: "预制菜说明书，加载即用", color: C.purple },
      { name: "Hooks", desc: "自动驾驶的传感器——检测到障碍物自动刹车", color: C.orange },
      { name: "MCP", desc: "USB-C 转接头，一个口连万物", color: C.green },
      { name: "Subagent", desc: "主编的实习生团队，领活→干活→汇报→回收", color: C.pink },
    ];

    const tableData = summaryRows.map((row) => [
      { text: row.name, options: { fontSize: 11, fontFace: "Consolas", color: row.color, bold: true, fill: { color: C.lightBg } } },
      { text: row.desc, options: { fontSize: 12, fontFace: "Calibri", color: C.textSecondary, fill: { color: C.lightBg } } },
    ]);

    s.addTable(tableData, {
      x: 0.6, y: 2.3, w: 8.5,
      colW: [1.8, 6.7],
      rowH: [0.52, 0.52, 0.52, 0.52, 0.52],
      border: { pt: 0.5, color: C.border },
      margin: [0.1, 0.2, 0.1, 0.2],
      autoPage: false,
    });

    addSlideNumber(s, 12, TOTAL, false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SLIDE 13: CLOSING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };
    s.addShape("ellipse", { x: 7, y: -2, w: 5, h: 5, fill: { color: C.pink, transparency: 92 } });
    s.addShape("ellipse", { x: -2, y: 2.5, w: 4, h: 4, fill: { color: C.orange, transparency: 92 } });

    s.addText("Vibe Coding 不是\"给 AI 打字就出网站\"的玩具。", {
      x: 0.7, y: 1.2, w: 8.5, h: 0.8,
      fontSize: 26, fontFace: "Georgia", color: C.textOnDark, italic: true, margin: 0,
    });

    s.addShape("line", { x: 0.7, y: 2.15, w: 0.8, h: 0, line: { color: C.pink, width: 2 } });

    s.addText([
      { text: "它是一种新的工作方式——", options: { fontSize: 22, fontFace: "Georgia", color: C.textOnDark, breakLine: true } },
      { text: "你不是在操作机器，", options: { fontSize: 22, fontFace: "Georgia", color: C.textOnDark, breakLine: true } },
      { text: "你是在管理一支 AI 团队。", options: { fontSize: 22, fontFace: "Georgia", color: C.textOnDark, bold: true } },
    ], { x: 0.7, y: 2.35, w: 8, h: 1.5, margin: 0 });

    s.addText("而这五个概念，就是这支团队的\"人力资源体系\"", {
      x: 0.7, y: 4.0, w: 8, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: C.textOnDarkMuted, charSpacing: 2, margin: 0,
    });

    s.addText("Subagent · Hooks · MCP · Skill · Claude.md", {
      x: 0.7, y: 4.45, w: 8, h: 0.3,
      fontSize: 9, fontFace: "Consolas", color: C.textOnDarkMuted, charSpacing: 3, margin: 0,
    });

    addSlideNumber(s, 13, TOTAL, true);
  }

  // ── Write ──
  const outPath = "d:/Code/what-i-do/article-creator/output/vibe-coding-核心概念.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to:", outPath);
}

main().catch((err) => { console.error(err); process.exit(1); });
