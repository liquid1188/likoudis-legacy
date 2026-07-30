#!/usr/bin/env python3
"""Regenerate search-index.json for sitewide search.

Covers every top-level page plus all essays. The gated /archive/ is deliberately
excluded so its contents never surface in public search results.

Run from the repo root after adding, removing, or editing content:
    python3 build-search-index.py
"""
import re, os, json, html, glob

SKIP_PAGES = {"essays.html"}          # its rows are the essays, indexed individually

def visible(fragment):
    fragment = re.sub(r"<(script|style|nav|footer)\b.*?</\1>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    fragment = re.sub(r"←\s*Back to (Essay Archive|Resources)", "", fragment)
    fragment = re.sub(r"Stay connected with the Foundation.*?Unsubscribe anytime\.", " ", fragment, flags=re.S)
    return re.sub(r"\s+", " ", fragment).strip()

def page_title(page, fallback):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S | re.I)
    if m: return visible(m.group(1))
    m = re.search(r"<title>(.*?)</title>", page, re.S | re.I)
    if m: return visible(m.group(1)).split("—")[0].strip()
    return fallback

def main():
    out = []

    # ── top-level pages ──
    for f in sorted(glob.glob("*.html")):
        if f in SKIP_PAGES: continue
        page = open(f, encoding="utf-8").read()
        slug = f[:-5]
        body = re.search(r"<body[^>]*>(.*)</body>", page, re.S | re.I)
        text = visible(body.group(1) if body else page)
        if len(text) < 40: continue
        out.append({"u": "/" if slug == "index" else "/" + slug,
                    "t": "Home" if slug == "index" else page_title(page, slug.replace("-", " ").title()),
                    "c": "page", "x": text})

    # ── resources ──
    for f in sorted(glob.glob("resources/*.html")):
        page = open(f, encoding="utf-8").read()
        body = re.search(r'<section class="essay-body">(.*?)</section>', page, re.S)
        out.append({"u": "/" + f[:-5], "t": page_title(page, os.path.basename(f)[:-5]),
                    "c": "resource", "x": visible(body.group(1) if body else page)})

    # ── essays, with their archive section ──
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

    for slug, title in rows:
        path = os.path.join("essays", slug + ".html")
        if not os.path.exists(path):
            print("  skipped (no file):", slug); continue
        page = open(path, encoding="utf-8").read()
        m = re.search(r'<section class="essay-body">(.*?)</section>', page, re.S)
        out.append({"u": "/essays/" + slug, "t": visible(title),
                    "c": tab_of.get(slug, "essay"), "x": visible(m.group(1)) if m else ""})

    json.dump(out, open("search-index.json", "w", encoding="utf-8"),
              ensure_ascii=False, separators=(",", ":"))
    kinds = {}
    for d in out: kinds[d["c"]] = kinds.get(d["c"], 0) + 1
    print("indexed %d documents -> search-index.json (%.1f KB)"
          % (len(out), os.path.getsize("search-index.json") / 1024))
    for k, v in sorted(kinds.items(), key=lambda x: -x[1]): print("   %-12s %3d" % (k, v))

if __name__ == "__main__":
    main()
