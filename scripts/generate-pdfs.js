/**
 * Converts DigiPermit markdown documentation to PDF (with Mermaid rendering).
 * Output: docs/pdf/*.pdf
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(DOCS, 'pdf');

const ALL_DOCS = [
  'MAJOR-PROJECT-SYSTEM-DESCRIPTION.md',
  'FINAL-PROJECT-REPORT.md',
  'PHASE1-PLANNING-AND-DESIGN.md',
  'PROJECT-PROPOSAL.md',
  'PRESENTATION-SLIDE-DECK.md',
  'DEMO-SCRIPT.md',
  'IS3-BPMN-PROCESS-MODELS.md',
  'IS3-ERD.md',
  'IS3-IOT-CONNECTIVITY-MAP.md',
  'IS3-AI-WORKFLOW.md',
  'POWER-BI-SETUP.md',
  'API-SPECIFICATION.md',
  'TEST-PLAN.md',
  'GITHUB-SETUP.md',
  'DEPLOY.md',
  'COMPLETE-SETUP-GUIDE.md',
  'ACADEMIC-INTEGRITY-DECLARATION.md',
  'ROLE-USER-STORIES-TEST-GUIDE.md',
  'PACKET-TRACER-LAB-GUIDE.md',
  'power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md',
  'sprints/SPRINT-1-REVIEW.md',
  'sprints/SPRINT-2-REVIEW.md',
  'sprints/SPRINT-3-REVIEW.md',
  'sprints/SPRINT-4-REVIEW.md',
];

const FINAL_ONLY = [
  'MAJOR-PROJECT-SYSTEM-DESCRIPTION.md',
  'FINAL-PROJECT-REPORT.md',
  'PHASE1-PLANNING-AND-DESIGN.md',
  'PRESENTATION-SLIDE-DECK.md',
  'DEMO-SCRIPT.md',
  'PROJECT-PROPOSAL.md',
];

function htmlShell(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    @page { margin: 18mm 15mm; }
    body {
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      max-width: 100%;
      padding: 0 8px;
    }
    h1 { font-size: 22pt; color: #0d5c3d; border-bottom: 2px solid #0d5c3d; padding-bottom: 6px; margin-top: 0; }
    h2 { font-size: 16pt; color: #145a32; margin-top: 1.4em; page-break-after: avoid; }
    h3 { font-size: 13pt; color: #1e7145; page-break-after: avoid; }
    h4 { font-size: 11.5pt; page-break-after: avoid; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; page-break-inside: avoid; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #e8f5ee; font-weight: 600; }
    tr:nth-child(even) { background: #f9fbf9; }
    code { background: #f4f4f4; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 9pt; page-break-inside: avoid; }
    pre code { background: none; padding: 0; }
    blockquote {
      border-left: 4px solid #0d5c3d;
      margin: 1em 0;
      padding: 8px 16px;
      background: #f0faf4;
      color: #333;
    }
    a { color: #0d5c3d; word-break: break-all; }
    hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
    ul, ol { padding-left: 1.4em; }
    li { margin: 0.25em 0; }
    .mermaid {
      text-align: center;
      margin: 1.2em 0;
      page-break-inside: avoid;
    }
    img { max-width: 100%; height: auto; }
    p { orphans: 3; widows: 3; }
    h1, h2, h3 { page-break-after: avoid; }
  </style>
</head>
<body>
${bodyHtml}
<script>
  mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose' });
</script>
</body>
</html>`;
}

function preprocessMermaid(md) {
  return md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const trimmed = code.trim();
    return `\n<div class="mermaid">\n${trimmed}\n</div>\n`;
  });
}

function outPathFor(relativeMd) {
  const base = relativeMd.replace(/\.md$/i, '.pdf').replace(/\//g, '-');
  return path.join(OUT, base);
}

async function mdToPdf(browser, relativeMd) {
  const src = path.join(DOCS, relativeMd);
  if (!fs.existsSync(src)) {
    console.warn(`  SKIP (missing): ${relativeMd}`);
    return false;
  }

  const md = fs.readFileSync(src, 'utf8');
  const processed = preprocessMermaid(md);
  const title = path.basename(relativeMd, '.md');
  const bodyHtml = marked.parse(processed);
  const html = htmlShell(title, bodyHtml);
  const dest = outPathFor(relativeMd);

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction(
    () => {
      const nodes = document.querySelectorAll('.mermaid');
      if (nodes.length === 0) return true;
      return [...nodes].every((n) => n.querySelector('svg') || n.getAttribute('data-processed') === 'true');
    },
    { timeout: 90000 }
  ).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));

  await page.pdf({
    path: dest,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '15mm', right: '15mm' },
  });
  await page.close();

  const stats = fs.statSync(dest);
  console.log(`  OK  ${relativeMd} -> pdf/${path.basename(dest)} (${(stats.size / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  const finalOnly = process.argv.includes('--final-only');
  const list = finalOnly ? FINAL_ONLY : ALL_DOCS;

  fs.mkdirSync(OUT, { recursive: true });

  console.log(`Converting ${list.length} document(s) to PDF...\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let ok = 0;
  let fail = 0;
  for (const doc of list) {
    try {
      const success = await mdToPdf(browser, doc);
      if (success) ok++;
    } catch (err) {
      console.error(`  FAIL ${doc}: ${err.message}`);
      fail++;
    }
  }

  await browser.close();
  console.log(`\nDone: ${ok} PDF(s) in docs/pdf/${fail ? `, ${fail} failed` : ''}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
