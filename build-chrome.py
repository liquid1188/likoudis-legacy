#!/usr/bin/env python3
"""Rewrite the shared <nav> and <footer> on every page from one definition.

The site is static HTML with no build step, so the nav and footer were
hand-copied into every file and drifted: 6 nav variants and 16 footer variants
across 310 pages, with the essay pages still showing a 2025 copyright.

Edit CHROME below, then run from the repo root:
    python3 build-chrome.py

{P} is the relative prefix: "" at the root, "../" inside essays/ and resources/.
/archive/ is skipped - gated pages carry their own minimal chrome.
"""
import re, glob, os, sys

NAV = '''<nav>
  <a href="{P}./" class="nav-logo">
    <img src="{P}images/logo-mark.png" alt="LLF">
    <span>Likoudis Legacy<br>Foundation</span>
  </a>
  <ul class="nav-links">
    <li class="nav-dropdown"><a href="{P}about">About</a><div class="nav-dropdown-menu"><a href="{P}about">About</a><a href="{P}james-likoudis">James Likoudis</a><a href="{P}team">Team</a><a href="{P}events">Events</a><a href="{P}contact">Contact</a></div></li>
    <li><a href="{P}kydones">Kydones Review</a></li>
    <li><a href="{P}books">Books</a></li>
    <li><a href="{P}fellows">Fellows Program</a></li>
    <li><a href="{P}bookclub">Book Club</a></li>
    <li><a href="{P}consulting">Consulting</a></li>
    <li class="nav-dropdown"><a href="#">Media</a><div class="nav-dropdown-menu"><a href="{P}resources">Resources</a><a href="{P}videos">Video Archive</a><a href="{P}essays">Essay Archive</a><a href="{P}photos">Photo Archive</a></div></li>
    <li><a href="{P}get-involved">Get Involved</a></li>
    <li><a href="{P}donate" class="nav-give">Give</a></li>
  </ul>
</nav>'''

FOOTER = '''<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="{P}./" aria-label="Likoudis Legacy Foundation home"><img src="{P}images/logo.png" alt="LLF Logo" style="display:block;"></a>
      <p>A 501(c)(3) research and educational foundation dedicated to ecumenical scholarship, Christian unity, and the promotion of religious liberty worldwide.</p>
      <address>Est. 2023 &middot; Baltimore, MD</address>
    </div>
    <div class="footer-col"><h4>Foundation</h4><ul><li><a href="{P}about">About</a></li><li><a href="{P}james-likoudis">James Likoudis</a></li><li><a href="{P}team">Team</a></li><li><a href="{P}events">Events</a></li><li><a href="{P}fellows">Fellows Program</a></li><li><a href="{P}bookclub">Book Club</a></li><li><a href="{P}contact">Contact</a></li><li><a href="https://andrewlikoudis.com" target="_blank" rel="noopener">Chairman&rsquo;s Site</a></li></ul></div>
    <div class="footer-col"><h4>Publications</h4><ul><li><a href="{P}resources">Resources</a></li><li><a href="{P}kydones">The Kydones Review</a></li><li><a href="{P}essays">Essay Archive</a></li><li><a href="{P}videos">Video Archive</a></li><li><a href="{P}photos">Photo Archive</a></li><li><a href="{P}books">Books</a></li></ul></div>
    <div class="footer-col"><h4>Support</h4><ul><li><a href="{P}donate">Give</a></li><li><a href="{P}get-involved">Get Involved</a></li><li><a href="{P}consulting">Consulting</a></li><li><a href="https://www.patreon.com/profile/creators?u=34254725" target="_blank" rel="noopener">Patreon</a></li></ul></div>
  </div>
  <div class="footer-bottom"><p>&copy; 2026 Likoudis Legacy Foundation &middot; Tax ID: 99-3126276 &middot; Site by <a href="https://lickitysplitweb.com/" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Lickity Split Web Design</a></p><div class="footer-social"><a href="https://twitter.com/LikoudisLegacy" target="_blank" rel="noopener" title="X / Twitter">&#120143;</a><a href="https://www.linkedin.com/in/andrewlikoudis/" target="_blank" rel="noopener" title="LinkedIn" style="font-size:0.75rem;font-weight:600;letter-spacing:0.04em;">in</a><a href="https://traditionandrenewal.substack.com" target="_blank" rel="noopener" title="T&amp;R Substack" style="font-family:Cormorant Garamond,serif;font-style:italic;font-size:0.75rem;letter-spacing:0.05em;">T&amp;R</a><a href="https://andrewlikoudis.com" target="_blank" rel="noopener" title="Andrew Likoudis" style="font-family:Cormorant Garamond,serif;font-size:0.75rem;letter-spacing:0.04em;">AL</a></div></div>
</footer>'''

def main():
    files = sorted(glob.glob("*.html") + glob.glob("essays/*.html") + glob.glob("resources/*.html"))
    changed = skipped = 0
    for f in files:
        prefix = "../" if os.path.dirname(f) else ""
        s = open(f, encoding="utf-8").read(); o = s
        for tag, tpl in (("nav", NAV), ("footer", FOOTER)):
            pat = re.compile(r"<%s[ >].*?</%s>" % (tag, tag), re.S)
            if not pat.search(s):
                print("  !! no <%s> in %s" % (tag, f)); continue
            s = pat.sub(lambda m: tpl.replace("{P}", prefix), s, count=1)
        if s != o:
            open(f, "w", encoding="utf-8").write(s); changed += 1
        else:
            skipped += 1
    print("rewritten: %d   already canonical: %d   total: %d" % (changed, skipped, len(files)))

if __name__ == "__main__":
    main()
