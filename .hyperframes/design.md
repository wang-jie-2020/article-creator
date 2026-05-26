# Design System — Vibe Coding 核心概念视频

从 HTML 演示文稿的 Neo Minimalism + Grainy Blur + Liquid Glass 风格提取。

## Colors

### Background
- `--bg-primary: #FAFAF8` — warm off-white
- `--bg-alt: #F5F3F0` — warm light beige
- `--bg-gradient: linear-gradient(135deg, #FAFAF8 0%, #F5F0E8 50%, #FAFAF8 100%)`

### Text
- `--text-primary: #1A1A1A` — near-black, slightly warm
- `--text-secondary: #666666` — muted body text
- `--text-tertiary: #999999` — labels, metadata

### Accents (克制使用)
- `--pink: #FF6B9D`
- `--orange: #FF7A45`
- `--green: #52C41A`
- `--purple: #722ED1`
- `--blue: #1890FF`
- `--cyan: #13C2C2`

### Structural
- `--border: #E5E5E3` — hairline rules
- `--border-dark: #1A1A1A` — emphasis rules
- `--glass-bg: rgba(255,255,255,0.7)` — card backgrounds
- `--glass-highlight: rgba(255,255,255,0.8)` — top edge of cards

## Typography

- **Display/Headlines:** Newsreader (serif, 300-900 weight range, editorial warmth)
- **Body:** DM Sans (sans-serif, 400-500 weight)
- **Mono/Labels:** Geist Mono (monospace, 300-500, for timestamps, metadata)

Weight contrast: 300 (labels, thin headlines) vs 900 (bold headlines). Extreme.

## Mood

克制、温暖、人文、专业。Neo Minimalism philosophy — less but better.
Warm editorial tone. Like a well-designed print magazine in video form.

## Motion

Calm, breath-like. Slow eases (`power1.out`, `sine.inOut`). 0.4-0.8s entrances.
Blur crossfades between scenes (calm variant: 25px blur, 0.6s+0.4s hold, then 0.6s clear).
Ambient: slow drift on blob decorations, subtle scale breath on noise layer.

## Do's
- Extreme weight contrast (100 vs 900)
- Generous whitespace
- Thin hairline rules as separators
- Single accent color per scene
- Glass card treatments with top-edge highlight
- Noise/grain texture overlay

## Don'ts
- No gradients on text
- No drop shadows heavier than the glass card spec
- No more than 2 accent colors visible simultaneously
- No busy backgrounds — let whitespace breathe
- No Inter, Roboto, or any banned font
