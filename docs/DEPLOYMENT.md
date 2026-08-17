# Deployment

Vercel, from the `main` branch of `github.com/Warren0204/portfolio`, live at
<https://portfolio-beta-coral-24.vercel.app>. Pushes to `main` deploy to
production; pull requests get preview deployments.

Project settings: framework preset **Other**, every build override **off**, and
**Root Directory blank**. `vercel.json` supplies the security and cache headers,
clean URLs, and a rewrite that sends unknown paths to `index.html` so deep links
survive a hard refresh.

## There is no build, and here is what not to "fix"

The source is the deployable artefact: Vercel publishes the repo exactly as
committed. Three things keep it that way, and each one has already caused an
outage once.

`vercel.json` cannot explain any of this itself — Vercel validates it against a
schema and rejects unknown keys, including the `"//"` comment convention that
works in `package.json`. Hence this file.

**`framework` is `null` on purpose.** Vite is in `devDependencies`, so Vercel
would otherwise apply the Vite preset, run `vite build`, and publish `dist/`.
That build succeeds and the site is broken: `assets/`, `robots.txt`,
`sitemap.xml`, and `site.webmanifest` never reach `dist/`, because they are read
at runtime through absolute paths rather than imported, and a bundler only
copies what it can statically see. Every image and the CV would 404 under a
green build log.

**The build script is `build:dist`, not `build`.** Vercel zero-config runs a
script named exactly `build` if it finds one. Renaming removes the trigger
instead of fighting it.

**Do not add `buildCommand` or `outputDirectory`.** Either one puts Vercel into
build mode, where it collects output from a directory this project never
produces and publishes an empty deployment — a 404 on every path, with
`WARNING! Build output contains no "functions" or "static" directory` as the
only clue in the log.

## The site URL is hardcoded in three files

Static HTML has nowhere to put a variable, so the canonical URL appears in:

    index.html    canonical, og:url, and the JSON-LD url
    robots.txt    the Sitemap: line
    sitemap.xml   the <loc>

Changing domain means editing those, and nothing else:

```bash
grep -rln 'portfolio-beta-coral-24.vercel.app' index.html robots.txt sitemap.xml
```

Keep them truthful. A canonical tag pointing at a domain that does not resolve
is worse than having none: it can drop the live URL out of search results.

`warrengallardo.dev` is not registered yet. Registering it and adding it under
Vercel's **Settings → Domains** is all that is needed, plus the three edits
above.

## Checks before pushing

```bash
npm run lint            # eslint + stylelint
npm run format:check    # prettier
```

## Tools

Two scripts exist because this project was built on a machine without Node.

**`tools/serve.ps1`** — a static server, for running the site without Node. ES
modules need HTTP, so opening `index.html` from the filesystem will not work.

```powershell
powershell -File tools/serve.ps1        # http://localhost:5173
```

**`tools/shot.ps1`** — screenshots the site at any device size. Windows will not
open a Chrome window narrower than about 484px, so a real phone width cannot be
checked by dragging the window; this drives Chrome over the DevTools protocol
instead, which can emulate any viewport.

```powershell
# start headless Chrome once
Start-Process chrome '--headless --disable-gpu --remote-debugging-port=9222 --user-data-dir=C:\Temp\cdp about:blank'

powershell -File tools/shot.ps1 -Width 390 -Height 844 -Scale 3 -Mobile -Out shot.png
powershell -File tools/shot.ps1 -Width 1440 -Height 900 -Out desktop.png
```

`-Mobile` sets the mobile flag as well as the size, so the bottom tab bar, the
bottom-sheet dialog, and the touch styles all appear.

## The design reference

`reference/` holds the original design mockup and is **not shipped**. Nothing in
it is served, and no shipped code imports from it.

| File | What it is |
|---|---|
| `reference/prototype.html` | The original self-contained export. Open it in a browser to see the intended design, copy, and interactions. |
| `reference/prototype.decoded.html` | The same page with its inlined assets unpacked, so the markup and data are readable. |
| `reference/unbundle.ps1` | Regenerates the decoded copy and `reference/extracted/`. |

`reference/extracted/` is generated and git-ignored:

```powershell
powershell -File reference/unbundle.ps1
```

Production assets were promoted out of that folder into `assets/`, which is the
only place shipped code reads images from. Base64 never enters source files.
