"""Generate PDF for docs/DEMO-REGISTRATION-QUICK-REFERENCE.md"""
from __future__ import annotations

import asyncio
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "DEMO-REGISTRATION-QUICK-REFERENCE.md"
DEST = ROOT / "docs" / "pdf" / "DEMO-REGISTRATION-QUICK-REFERENCE.pdf"

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{title}</title>
  <style>
    @page {{ margin: 18mm 15mm; }}
    body {{
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
    }}
    h1 {{ font-size: 20pt; color: #0d5c3d; border-bottom: 2px solid #0d5c3d; padding-bottom: 6px; }}
    h2 {{ font-size: 14pt; color: #145a32; margin-top: 1.2em; page-break-after: avoid; }}
    h3 {{ font-size: 12pt; color: #1e7145; }}
    table {{ border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 10pt; page-break-inside: avoid; }}
    th, td {{ border: 1px solid #ccc; padding: 6px 8px; text-align: left; }}
    th {{ background: #e8f5ee; }}
    code {{ background: #f4f4f4; padding: 1px 4px; font-size: 10pt; }}
    blockquote {{ border-left: 4px solid #0d5c3d; padding: 8px 14px; background: #f0faf4; margin: 1em 0; }}
  </style>
</head>
<body>{body}</body>
</html>
"""


async def main() -> None:
    try:
        import markdown
        from playwright.async_api import async_playwright
    except ImportError:
        import subprocess

        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "markdown", "playwright", "-q"]
        )
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        import markdown
        from playwright.async_api import async_playwright

    if not SRC.exists():
        print(f"Missing: {SRC}")
        sys.exit(1)

    DEST.parent.mkdir(parents=True, exist_ok=True)
    body = markdown.markdown(
        SRC.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code", "sane_lists"],
    )
    html = HTML_TEMPLATE.format(title="DigiPermit Demo Quick Reference", body=body)

    print(f"Generating {DEST.name}...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="networkidle", timeout=120_000)
        await page.pdf(
            path=str(DEST),
            format="A4",
            print_background=True,
            margin={"top": "18mm", "bottom": "18mm", "left": "15mm", "right": "15mm"},
        )
        await browser.close()

    print(f"OK  {DEST} ({DEST.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
