# Eleven XI — Setup Guide

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/eleven-xi.git
cd eleven-xi
```

Replace `YOUR_USERNAME` with your GitHub username.

## 2. Dependencies

No install step required. This is a plain HTML/CSS/JS project with no build tools, no Node.js, and no package manager. All dependencies (fonts, PeerJS) are loaded from CDN at runtime.

The only thing you need is **Python 3** (comes pre-installed on macOS):

```bash
python3 --version
```

## 3. Run locally

From inside the project folder:

```bash
python3 -m http.server 8777
```

Then open your browser and go to:

```
http://localhost:8777/index.html
```

The game will load. Keep the terminal running while you play.

## 4. Run the standalone offline build

The file `eleven-xi.html` is a single self-contained HTML file with all CSS, JS, and data inlined. You can open it directly in any browser without a server:

```bash
open eleven-xi.html
```

Or just double-click the file in Finder.

Note: the service worker (PWA install) only works when served over HTTP, not from `file://`. Use the server above if you need PWA features.

## 5. Rebuild the offline app after making changes

After editing any source file, regenerate `eleven-xi.html` by running this from the project root:

```bash
python3 -c "
import re, pathlib, base64, mimetypes
root = pathlib.Path('.')

def inline_file(path):
    p = root / path
    if not p.exists():
        return ''
    mt = mimetypes.guess_type(str(p))[0] or 'text/plain'
    if mt.startswith('image'):
        return f'data:{mt};base64,' + base64.b64encode(p.read_bytes()).decode()
    return p.read_text(encoding='utf-8')

html = (root / 'index.html').read_text(encoding='utf-8')
# Inline CSS
html = re.sub(r'<link rel=\"stylesheet\" href=\"([^\"]+\.css[^\"]*)\">', lambda m: '<style>' + inline_file(m.group(1).split('?')[0]) + '</style>', html)
# Inline JS
html = re.sub(r'<script src=\"([^\"]+\.js[^\"]*)\"(.*?)></script>', lambda m: '<script' + m.group(2) + '>' + inline_file(m.group(1).split('?')[0]) + '</script>', html)
(root / 'eleven-xi.html').write_text(html, encoding='utf-8')
print('Built eleven-xi.html')
"
```

## 6. Bump the cache version after changes

Any time you edit a CSS or JS file, you must bump the cache version in two places or browsers will serve stale files:

**In `sw.js`** — change the cache name:
```js
var CACHE = "wcxi-v85";  // increment the number
```

**In `index.html`** — update the `?v=` query string on the changed file's `<link>` or `<script>` tag:
```html
<link rel="stylesheet" href="floodlights.css?v=86">
<script src="floodlights.js?v=86"></script>
```

Both numbers must match.

## 7. Environment variables

None. There are no API keys, no environment variables, and no `.env` files. All configuration is hardcoded in the source files.

## 8. Push changes back to GitHub

After making changes:

```bash
git add -A
git commit -m "Your commit message"
git push
```

If you need to set your identity first:

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

## 9. Temporary live link (Cloudflare tunnel)

To share a live link without deploying, use the Cloudflare quick tunnel binary already downloaded at `/tmp/cloudflared`:

```bash
# Make sure the local server is running first (step 3 above), then:
/tmp/cloudflared tunnel --url http://localhost:8777
```

It will print a unique URL like `https://something.trycloudflare.com`. This URL changes every time you restart the tunnel and dies if your Mac sleeps. It is not a permanent hosting solution.

## 10. Permanent hosting

The project is ready to deploy to GitHub Pages, Netlify, or Cloudflare Pages — all free. No build step is needed; just point the host at the repo root and set `index.html` as the entry point.
