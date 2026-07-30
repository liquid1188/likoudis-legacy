#!/usr/bin/env python3
"""Regenerate search-index.json for the essay archive.

Run from the repo root after adding, removing, or editing essays:
    python3 build-search-index.py

The archive search reads this file. Without it, search falls back to matching
titles only, which misses most of the corpus.
"""
import re, os, json, html

def visible(fragment):
    fragment = re.sub(r"<(script|style)\b.*?</\1>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    fragment = re.sub(r"←\s*Back to Essay Archive", "", fragment)
    return re.sub(r"\s+", " ", fragment).strip()

def main():
    index_html = open("essays.html", encoding="utf-8").read()
    rows = re.findall(
        r'<a href="essays/([^"]+)" class="essay-row">\s*<div class="essay-row-title">(.*?)</div>',
        index_html, re.S)
    tab_of = {}
    for panel in re.finditer(
            r'<div class="tab-panel[^"]*" id="tab-([^"]+)">(.*?)(?=<div class="tab-panel|\Z)',
            index_html, re.S):
        for slug in re.findall(r'href="essays/([^"]+)"', panel.group(2)):
            tab_of[slug] = panel.group(1)

    out = []
    for slug, title in rows:
        path = os.path.join("essays", slug + ".html")
        if not os.path.exists(path):
            print("  skipped (no file):", slug); continue
        page = open(path, encoding="utf-8").read()
        m = re.search(r'<section class="essay-body">(.*?)</section>', page, re.S)
        out.append({"s": slug,
                    "t": visible(title),
                    "c": tab_of.get(slug, ""),
                    "x": visible(m.group(1)) if m else ""})

    json.dump(out, open("search-index.json", "w", encoding="utf-8"),
              ensure_ascii=False, separators=(",", ":"))
    print("indexed %d essays -> search-index.json (%.1f KB)"
          % (len(out), os.path.getsize("search-index.json") / 1024))

if __name__ == "__main__":
    main()
