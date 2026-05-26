# Production Breakdown — Vibe Coding 核心概念

**Style:** Neo Minimalism + Grainy Blur + Liquid Glass
**Palette:** #FAFAF8 bg, #1A1A1A text, warm pop accents
**Fonts:** Newsreader (display), DM Sans (body), Geist Mono (mono)
**Duration:** ~320s (5m20s) across 13 scenes
**Dimensions:** 1920×1080 landscape

## Rhythm Declaration

`intro-breathe-BUILD-breathe-CASCADE-breath-SUMMARIZE-close`

Calm editorial pacing throughout. Each concept scene is a "hold" (~20-30s narration), intro/outro are shorter (~12-15s). Blur crossfade (calm variant) between all scenes.

## Global Rules

- Canvas: #FAFAF8 warm white. Noise texture overlay at 2.5% opacity with slow drift.
- Glass cards: `rgba(255,255,255,0.7)` + backdrop-blur + top-edge highlight.
- Blur crossfade between all scenes: Calm variant (25px blur, 0.6s in + 0.4s hold + 0.6s clear).
- All scenes use entrance animations only. No exit animations (transition handles exit).
- Offsets: first entrance at 0.15-0.2s into scene. Vary eases across entrances.
- Ambient motion: blob decorations drift, noise texture breathes at 8s cycle.

## Scene-by-Scene Breakdown

### Scene 1: Title (0-12s)
- **Concept:** Warm, editorial opening. Title SLIDES in from below, subtitle FLOATS up gently.
- **Depth:** BG warm gradient + noise + radial blob (top-right), MG title card, FG divider rule + metadata labels.
- **Choreography:** Rule bar SCALES from 0 at 0.2s. Title FLOATS up + fades at 0.4s. Subtitle FLOATS at 0.7s. Description TYPES in at 1.0s.
- **Transition out:** Blur crossfade (calm) at 12s.

### Scene 2: Phenomenon (12-32s)
- **Concept:** "打字就能出网站，这不是魔术" — warm, inviting. Quote block anchored left.
- **Depth:** BG warm gradient + noise + blob (bottom-right), MG quote card (glass), FG accent rule left edge.
- **Choreography:** Quote card FLOATS up at 12.3s. Quote mark SCALES in at 12.6s. Body text FADES at 12.9s. Secondary text FADES at 13.5s.
- **Transition out:** Blur crossfade (calm) at 32s.

### Scene 3: Problem (32-52s)
- **Concept:** "只用基础对话，很快就会撞到天花板" — slightly tenser. Glass card with three problem points.
- **Depth:** BG alt (#F5F3F0) + noise, MG glass card with list items, FG accent dots.
- **Choreography:** Glass card FLOATS at 32.3s. Three list items CASCADE in staggered 0.25s starting 32.8s. Accent text FADES at 33.8s.
- **Transition out:** Blur crossfade (calm) at 52s.

### Scene 4: Overview (52-75s)
- **Concept:** Five concept cards in a grid. Clean information architecture.
- **Depth:** BG warm white + noise, MG 5 concept cards in 3+2 grid, FG scene number.
- **Choreography:** Headline FLOATS at 52.3s. Five cards CASCADE in staggered 0.12s starting 52.9s.
- **Transition out:** Blur crossfade (calm) at 75s.

### Scene 5: Subagent (75-102s)
- **Concept:** "主编的实习生团队" — metaphor first. Quote block with the editor/intern analogy.
- **Depth:** BG alt + blob, MG quote block (left border accent: pink), FG concept label "01 Subagent".
- **Choreography:** Concept label FADES at 75.3s. Headline FLOATS at 75.6s. Quote mark SCALES at 76.2s. Quote text FADES at 76.5s. Explanation FLOATS at 77.5s.
- **Transition out:** Blur crossfade (calm) at 102s.

### Scene 6: Hooks (102-128s)
- **Concept:** "自动驾驶的传感器" — three hook examples in glass card. Orange accent.
- **Depth:** BG warm white + noise, MG glass card with hook list, FG accent rule.
- **Choreography:** Headline FLOATS at 102.3s. Quote block FLOATS at 102.8s. Glass card with 3 items CASCADES at 103.5s.
- **Transition out:** Blur crossfade (calm) at 128s.

### Scene 7: MCP (128-156s)
- **Concept:** "USB-C 万能转接头" — green accent. Before/After contrast with "盲人 CEO" metaphor.
- **Depth:** BG alt + blob, MG quote block (green left border), FG concept label.
- **Choreography:** Headline FLOATS at 128.3s. Quote CASCADES at 128.8s. CEO metaphor FADES at 129.8s.
- **Transition out:** Blur crossfade (calm) at 156s.

### Scene 8: Skill (156-182s)
- **Concept:** "预制菜操作说明书" — purple accent. Director/cameraman metaphor.
- **Depth:** BG warm white + noise, MG quote block (purple left border), FG concept label.
- **Choreography:** Headline FLOATS at 156.3s. Quote SCALES at 156.8s. Explanation FLOATS at 157.8s.
- **Transition out:** Blur crossfade (calm) at 182s.

### Scene 9: Claude.md (182-208s)
- **Concept:** "贴在墙上的员工守则" — blue accent. Restaurant metaphor. Before/After contrast.
- **Depth:** BG alt + blob, MG quote block (blue left border), FG concept label.
- **Choreography:** Headline FLOATS at 182.3s. Quote FLOATS at 182.8s. Before/After contrast CASCADES at 183.8s.
- **Transition out:** Blur crossfade (calm) at 208s.

### Scene 10: Integration Pipeline (208-248s)
- **Concept:** "五步配合流程" — all 5 concepts in pipeline steps. Blog building scenario.
- **Depth:** BG warm white + noise, MG 5 pipeline cards with arrows, FG scene number.
- **Choreography:** Headline FLOATS at 208.3s. Pipeline step 1 SCALES at 208.8s. Steps 2-5 CASCADE in 0.5s intervals. Final explanation FLOATS at 212.0s.
- **Transition out:** Blur crossfade (calm) at 248s.

### Scene 11: Complete System (248-268s)
- **Concept:** "你感觉只是在聊天，背后是一整条生产线" — glass card summary.
- **Depth:** BG alt + blob, MG large glass card with system summary, FG accent rule.
- **Choreography:** Headline FLOATS at 248.3s. Glass card FLOATS + SCALES at 248.8s. Flow text FADES at 249.5s. Closing sentence FADES at 250.5s.
- **Transition out:** Blur crossfade (calm) at 268s.

### Scene 12: Summary Table (268-295s)
- **Concept:** "人话总结 — 五个类比一张表" — clean comparison table.
- **Depth:** BG warm white + noise, MG summary table (5 rows), FG scene number.
- **Choreography:** Headline FLOATS at 268.3s. Table rows CASCADE in staggered 0.15s starting 268.8s.
- **Transition out:** Blur crossfade (calm) at 295s.

### Scene 13: Closing (295-320s)
- **Concept:** "管理一支 AI 团队" — editorial closing. Serif quote centered, warm gradient behind.
- **Depth:** BG warm gradient + noise + two blobs, MG centered quote text, FG divider + metadata.
- **Choreography:** Quote line 1 FLOATS at 295.3s. Divider SCALES at 296.0s. Quote line 2 FLOATS at 296.4s. Subtitle FADES at 297.2s. Five concept tags FADE at 297.8s.
- **Transition out:** Fade all to bg color + blur at 319s (final scene — allowed exit).

## Recurring Motifs

- Noise texture layer (2.5% opacity) across all scenes — continuity
- Blob decorations (warm beige radial gradients, 25% opacity, slow drift) — 2 per scene minimum
- Glass card treatment with top-edge highlight
- Scene number (large, 100-weight, #E5E5E3, top-right corner) on scenes 3-12
- Hairline divider rule (60px, #1A1A1A) on title and closing scenes
- Concept scenes each use a different accent color for their left-border metaphor block

## Negative Prompt

- No pure black (#000) — always tinted #1A1A1A
- No gradient text
- No Inter, Roboto, or any banned font
- No drop shadows darker than 6% opacity
- No centered-and-floating single-element layouts — always anchor to edges or use cards
- No more than 2 pop colors visible simultaneously
- No exit animations except on final scene
