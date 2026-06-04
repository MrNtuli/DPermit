"""Generate PDF for docs/MAJOR-PROJECT-SYSTEM-DESCRIPTION.md only."""
from __future__ import annotations

import asyncio
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "MAJOR-PROJECT-SYSTEM-DESCRIPTION.md"
OUT_DIR = ROOT / "docs" / "pdf"
OUT = OUT_DIR / "MAJOR-PROJECT-SYSTEM-DESCRIPTION.pdf"

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DigiPermit — Major Project System Description</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    @page {{ margin: 18mm 15mm; }}
    body {{
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      padding: 0 8px;
    }}
    h1 {{ font-size: 22pt; color: #0d5c3d; border-bottom: 2px solid #0d5c3d; padding-bottom: 6px; }}
    h2 {{ font-size: 16pt; color: #145a32; margin-top: 1.4em; page-break-after: avoid; }}
    h3 {{ font-size: 13pt; color: #1e7145; page-break-after: avoid; }}
    table {{ border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; page-break-inside: avoid; }}
    th, td {{ border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }}
    th {{ background: #e8f5ee; }}
    tr:nth-child(even) {{ background: #f9fbf9; }}
    code {{ background: #f4f4f4; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }}
    pre {{ background: #f4f4f4; padding: 10px; border-radius: 4px; font-size: 9pt; page-break-inside: avoid; }}
    pre code {{ background: none; padding: 0; }}
    blockquote {{
      border-left: 4px solid #0d5c3d;
      margin: 1em 0;
      padding: 8px 16px;
      background: #f0faf4;
    }}
    a {{ color: #0d5c3d; word-break: break-all; }}
    hr {{ border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }}
    .mermaid {{ text-align: center; margin: 1.2em 0; page-break-inside: avoid; }}
  </style>
</head>
<body>
{body}
<script>mermaid.initialize({{ startOnLoad: true, theme: "neutral", securityLevel: "loose" }});</script>
</body>
</html>
"""


def preprocess_mermaid(md: str) -> str:
    return re.sub(
        r"```mermaid\n([\s\S]*?)```",
        lambda m: f'\n<div class="mermaid">\n{m.group(1).strip()}\n</div>\n',
        md,
    )


async def main() -> None:
    try:
        import markdown
        from playwright.async_api import async_playwright
    except ImportError:
        print("Installing markdown and playwright...", file=sys.stderr)
        import subprocess

        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "markdown", "playwright", "-q"]
        )
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        import markdown
        from playwright.async_api import async_playwright

    if not SRC.exists():
        raise FileNotFoundError(f"Source not found: {SRC}")

    md = SRC.read_text(encoding="utf-8")
    body = markdown.markdown(
        preprocess_mermaid(md),
        extensions=["tables", "fenced_code", "toc", "sane_lists"],
    )
    html = HTML_TEMPLATE.format(body=body)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="networkidle", timeout=120_000)
        await page.wait_for_timeout(4000)
        await page.pdf(
            path=str(OUT),
            format="A4",
            print_background=True,
            margin={"top": "18mm", "bottom": "18mm", "left": "15mm", "right": "15mm"},
        )
        await browser.close()

    size_kb = OUT.stat().st_size / 1024
    print(f"Created: {OUT} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
