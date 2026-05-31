#!/usr/bin/env python3
"""
Generate a WeChat Official Account cover image (900×383px, 2.35:1).
Maize theme — warm paper color with corn-gold accents.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 900, 383
BG_COLOR = "#fafafa"
ACCENT = "#E49123"
ACCENT_LIGHT = "#ffb11b"
TEXT_COLOR = "#333333"
SUB_COLOR = "#8b6914"


def find_font(size):
    """Find a suitable Chinese font."""
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/System/Library/Fonts/STHeiti Medium.ttc",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def generate_cover(title, output_path="output/cover.png"):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Top accent bar
    draw.rectangle([(0, 0), (WIDTH, 6)], fill=ACCENT)

    # Bottom accent bar
    draw.rectangle([(0, HEIGHT - 4), (WIDTH, HEIGHT)], fill="#e8d5a8")

    # Decorative line above title area
    y_deco = 60
    draw.line([(350, y_deco), (550, y_deco)], fill=ACCENT_LIGHT, width=2)

    label_font = find_font(14)
    draw.text(
        (WIDTH // 2, y_deco - 20),
        "公众号运营",
        fill=SUB_COLOR,
        font=label_font,
        anchor="ms",
    )

    # Main title — wrap if too long
    title_font = find_font(34)
    max_title_width = WIDTH - 100

    # Simple wrapping
    lines = []
    current_line = ""
    for char in title:
        test_line = current_line + char
        bbox = title_font.getbbox(test_line)
        if bbox[2] - bbox[0] > max_title_width and current_line:
            lines.append(current_line)
            current_line = char
        else:
            current_line = test_line
    if current_line:
        lines.append(current_line)

    if len(lines) > 2:
        lines = lines[:2]
        lines[-1] = lines[-1][: -1] + "…"

    title_start_y = 145
    for idx, line in enumerate(lines):
        draw.text(
            (WIDTH // 2, title_start_y + idx * 52),
            line,
            fill=TEXT_COLOR,
            font=title_font,
            anchor="ms",
        )

    # Subtitle / tagline
    tag_y = title_start_y + len(lines) * 52 + 30
    tag_font = find_font(16)
    draw.text(
        (WIDTH // 2, tag_y),
        "新手避坑指南 · 从编辑到群发的完整实操手册",
        fill="#888888",
        font=tag_font,
        anchor="ms",
    )

    # Bottom-right small accent circle
    circle_r = 18
    circle_x = WIDTH - 80
    circle_y = HEIGHT - 60
    draw.ellipse(
        [(circle_x - circle_r, circle_y - circle_r), (circle_x + circle_r, circle_y + circle_r)],
        outline=ACCENT,
        width=2,
    )

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Cover saved to {output_path} ({WIDTH}×{HEIGHT})")


if __name__ == "__main__":
    title = sys.argv[1] if len(sys.argv) > 1 else "公众号发文章新手避坑指南"
    output = sys.argv[2] if len(sys.argv) > 2 else "output/cover.png"
    generate_cover(title, output)
