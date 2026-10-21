"""Inline header.html and footer.html into every page so the shared header/footer
(including the H1) exist in the raw HTML, without relying on JavaScript.

Re-run after editing header.html or footer.html:  python sync-shared.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SHARED = {
    "header": (ROOT / "header.html").read_text(encoding="utf-8").strip(),
    "footer": (ROOT / "footer.html").read_text(encoding="utf-8").strip(),
}

changed = 0
for page in sorted(ROOT.glob("*.html")):
    if page.name in ("header.html", "footer.html"):
        continue
    text = page.read_text(encoding="utf-8")
    original = text
    for name, html in SHARED.items():
        block = f"<!-- shared-{name}:start -->\n{html}\n<!-- shared-{name}:end -->"
        pattern = re.compile(
            rf'<div id="site-{name}"></div>|<!-- shared-{name}:start -->.*?<!-- shared-{name}:end -->',
            re.S,
        )
        text = pattern.sub(lambda _m: block, text, count=1)
    if text != original:
        page.write_text(text, encoding="utf-8", newline="")
        changed += 1
        print("updated", page.name)
print(f"{changed} page(s) updated")
