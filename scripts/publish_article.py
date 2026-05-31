#!/usr/bin/env python3
"""
Convert Markdown article to WeChat HTML and publish to drafts.
Uses Maize theme (柔和玉米) for styling.

Usage:
  python3 publish_article.py \
    --article articles/公众号发文章新手避坑指南.md \
    --title "标题" \
    --author "作者" \
    --digest "摘要"
"""

import json
import os
import re
import sys
import argparse
import urllib.request
import urllib.parse


# ── Maize Theme CSS (inline styles for WeChat compatibility) ──

BASE_STYLE = (
    'background-color:#fafafa;'
    'color:#333333;'
    'font-size:15px;'
    'line-height:1.75;'
    'letter-spacing:0.5px;'
    'padding:12px;'
    'font-family:-apple-system,BlinkMacSystemFont,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;'
)

H1_STYLE = (
    'color:#1a1a1a;'
    'font-weight:900;'
    'text-align:center;'
    'font-size:22px;'
    'margin:1.5em 0 0.5em;'
    'padding-bottom:12px;'
)

H2_STYLE = (
    'color:#333333;'
    'border-left:4px solid #ffb11b;'
    'padding-left:12px;'
    'font-size:18px;'
    'font-weight:700;'
    'margin:1.8em 0 0.6em;'
)

H3_STYLE = (
    'color:#4a4a4a;'
    'font-weight:600;'
    'font-size:16px;'
    'margin:1.2em 0 0.4em;'
)

STRONG_STYLE = (
    'color:#E49123;'
    'font-weight:700;'
    'border-bottom:2px solid #ffb11b;'
)

EM_STYLE = (
    'background-color:#fff9f9;'
    'font-style:normal;'
    'padding:0 3px;'
)

BLOCKQUOTE_STYLE = (
    'background-color:#fff9f9;'
    'border-left:3px solid #ffb11b;'
    'color:#6a737d;'
    'padding:8px 14px;'
    'margin:1em 0;'
)

HR_STYLE = (
    'color:#b8a88a;'
    'text-align:center;'
    'margin:2em 0;'
)

CODE_STYLE = (
    'color:#c0392b;'
    'background-color:#f0f0f0;'
    'padding:2px 6px;'
    'font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;'
    'font-size:14px;'
)

LINK_STYLE = (
    'color:#E49123;'
    'border-bottom:1px dashed #E49123;'
    'text-decoration:none;'
)

LIST_STYLE = 'margin:0.4em 0;padding-left:1.2em;'


def md_to_wechat_html(md_text):
    """Convert markdown to WeChat-compatible HTML with Maize theme inline styles."""

    lines = md_text.split('\n')
    result = []
    in_ul = False
    in_ol = False
    in_blockquote = False
    title_handled = False

    # Helper to close open lists
    def close_lists():
        nonlocal in_ul, in_ol
        tags = []
        if in_ol:
            tags.append('</ol>')
            in_ol = False
        if in_ul:
            tags.append('</ul>')
            in_ul = False
        return tags

    i = 0
    while i < len(lines):
        line = lines[i]

        # Title (first H1) — not the main title, skip ## too but only if it's the very first
        if line.startswith('# ') and not title_handled:
            title_handled = True
            i += 1
            continue

        # Empty line
        if not line.strip():
            result.extend(close_lists())
            result.append('<p style="margin:0.5em 0;">&nbsp;</p>')
            i += 1
            continue

        # Horizontal rule
        if line.strip() == '---' or line.strip() == '***':
            result.extend(close_lists())
            result.append(
                f'<p style="{HR_STYLE}">· · · ✦ · · ·</p>'
            )
            i += 1
            continue

        # H2: ## ...
        if line.startswith('## '):
            result.extend(close_lists())
            text = line[3:].strip()
            result.append(f'<h2 style="{H2_STYLE}">{text}</h2>')
            i += 1
            continue

        # H3: ### ...
        if line.startswith('### '):
            result.extend(close_lists())
            text = line[4:].strip()
            result.append(f'<h3 style="{H3_STYLE}">{text}</h3>')
            i += 1
            continue

        # Blockquote
        if line.startswith('> '):
            if not in_blockquote:
                in_blockquote = True
                result.append(f'<blockquote style="{BLOCKQUOTE_STYLE}">')
            text = line[2:].strip()
            # Process inline
            text = process_inline(text)
            result.append(f'<p style="margin:0.3em 0;">{text}</p>')
            i += 1
            continue
        else:
            if in_blockquote:
                in_blockquote = False
                result.append('</blockquote>')

        # Unordered list
        if re.match(r'^[-*]\s+', line):
            result.extend(close_lists())
            if not in_ul:
                in_ul = True
                result.append(f'<ul style="{LIST_STYLE}">')
            text = re.sub(r'^[-*]\s+', '', line)
            text = process_inline(text)
            result.append(f'<li style="margin:0.2em 0;">{text}</li>')

            # Look ahead: collect sub-items or continuation lines
            j = i + 1
            while j < len(lines):
                nl = lines[j]
                if re.match(r'^[-*]\s+', nl):
                    text = re.sub(r'^[-*]\s+', '', nl)
                    text = process_inline(text)
                    result.append(f'<li style="margin:0.2em 0;">{text}</li>')
                    j += 1
                elif nl.startswith('  ') or (nl.strip() and not nl.startswith('#') and not nl.startswith('>') and nl.strip() not in ('---', '***')):
                    # continuation line for the list item
                    text = process_inline(nl.strip())
                    result.append(f'<p style="margin:0.2em 0 0.2em 1em;font-size:14px;color:#555;">{text}</p>')
                    j += 1
                else:
                    break
            i = j
            continue

        # Ordered list
        if re.match(r'^\d+\.\s+', line):
            result.extend(close_lists())
            if not in_ol:
                in_ol = True
                result.append(f'<ol style="{LIST_STYLE}">')
            text = re.sub(r'^\d+\.\s+', '', line)
            text = process_inline(text)
            result.append(f'<li style="margin:0.2em 0;">{text}</li>')
            i += 1
            continue

        # Regular paragraph
        result.extend(close_lists())
        text = process_inline(line.strip())
        if text:
            result.append(f'<p style="margin:0.4em 0;">{text}</p>')
        i += 1

    # Final cleanup
    result.extend(close_lists())
    if in_blockquote:
        result.append('</blockquote>')

    body = '\n'.join(result)
    return body


def process_inline(text):
    """Process inline markdown: **bold**, *italic*, `code`, [links](url)"""

    # Inline code (must be before bold/italic to avoid conflicts)
    text = re.sub(r'`([^`]+)`', lambda m: f'<code style="{CODE_STYLE}">{m.group(1)}</code>', text)

    # Bold: **text**
    text = re.sub(
        r'\*\*(.+?)\*\*',
        lambda m: f'<strong style="{STRONG_STYLE}">{m.group(1)}</strong>',
        text
    )

    # Italic: *text* (but not inside bold)
    text = re.sub(r'(?<!\*)\*([^*\n]+)\*(?!\*)', lambda m: f'<em style="{EM_STYLE}">{m.group(1)}</em>', text)

    # Links: [text](url)
    text = re.sub(
        r'\[([^\]]+)\]\(([^)]+)\)',
        lambda m: f'<a href="{m.group(2)}" style="{LINK_STYLE}">{m.group(1)}</a>',
        text
    )

    # Checkbox: - [ ] and - [x]
    text = re.sub(r'\[ \]', '<span style="display:inline-block;width:16px;height:16px;border:2px solid #ccc;border-radius:2px;vertical-align:middle;margin-right:6px;"></span>', text)
    text = re.sub(r'\[x\]', '<span style="display:inline-block;width:16px;height:16px;border:2px solid #ffb11b;border-radius:2px;vertical-align:middle;margin-right:6px;background-color:#ffb11b;color:#fff;font-size:10px;text-align:center;line-height:16px;">✓</span>', text)

    return text


def get_access_token():
    """Get WeChat access token from ~/.wechat/config"""
    config_path = os.path.expanduser("~/.wechat/config")
    config = {}
    with open(config_path) as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                config[k.strip()] = v.strip()

    url = (
        f"https://api.weixin.qq.com/cgi-bin/token"
        f"?grant_type=client_credential"
        f"&appid={config['WECHAT_APPID']}"
        f"&secret={config['WECHAT_APPSECRET']}"
    )
    req = urllib.request.Request(url)
    resp = json.loads(urllib.request.urlopen(req).read())
    if 'access_token' not in resp:
        raise RuntimeError(f"Failed to get access_token: {resp}")
    return resp['access_token']


def upload_cover(token, image_path):
    """Upload cover image as permanent material. Returns media_id."""
    url = f"https://api.weixin.qq.com/cgi-bin/material/add_material?access_token={token}&type=image"

    import requests
    with open(image_path, 'rb') as f:
        files = {'media': (os.path.basename(image_path), f, 'image/png')}
        resp = requests.post(url, files=files).json()

    if 'media_id' not in resp:
        raise RuntimeError(f"Failed to upload cover: {resp}")
    return resp['media_id']


def create_draft(token, title, author, digest, html_content, thumb_media_id):
    """Create a WeChat draft via the draft/add API."""
    url = f"https://api.weixin.qq.com/cgi-bin/draft/add?access_token={token}"

    articles = [{
        "title": title,
        "author": author,
        "digest": digest,
        "content": html_content,
        "content_source_url": "",
        "thumb_media_id": thumb_media_id,
        "need_open_comment": 0,
        "only_fans_can_comment": 0,
        "pic_crop_235_1": "",
        "pic_crop_1_1": "",
    }]

    payload = {"articles": articles}
    data = json.dumps(payload, ensure_ascii=False).encode('utf-8')

    req = urllib.request.Request(
        url,
        data=data,
        headers={'Content-Type': 'application/json; charset=utf-8'},
        method='POST'
    )

    resp = json.loads(urllib.request.urlopen(req).read())
    return resp


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--article', required=True)
    parser.add_argument('--title', required=True)
    parser.add_argument('--author', default='')
    parser.add_argument('--digest', default='')
    parser.add_argument('--cover', default='', help='Cover image path (900×383px PNG)')
    parser.add_argument('--dry-run', action='store_true', help='Only generate HTML, do not publish')
    args = parser.parse_args()

    # Read article
    with open(args.article, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Convert to WeChat HTML
    body_html = md_to_wechat_html(md_text)

    # Wrap in full article HTML
    full_html = (
        f'<section style="{BASE_STYLE}">\n'
        f'{body_html}\n'
        f'</section>'
    )

    if args.dry_run:
        output_path = args.article.replace('.md', '_wechat.html')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_html)
        print(f"HTML written to {output_path}")
        print(f"HTML length: {len(full_html)} chars")
        return

    # Get token and upload cover
    print("Getting access token...")
    token = get_access_token()
    print(f"Token obtained: {token[:16]}...")

    thumb_media_id = ""
    if args.cover:
        print(f"Uploading cover: {args.cover}")
        thumb_media_id = upload_cover(token, args.cover)
        print(f"Cover uploaded, media_id: {thumb_media_id}")

    print(f"Creating draft: {args.title}")
    resp = create_draft(token, args.title, args.author, args.digest, full_html, thumb_media_id)
    print(f"Response: {json.dumps(resp, ensure_ascii=False, indent=2)}")

    if 'media_id' in resp:
        print(f"\n✅ Draft created! Media ID: {resp['media_id']}")
    else:
        print(f"\n❌ Failed. Error: {resp}")
        sys.exit(1)


if __name__ == '__main__':
    main()
