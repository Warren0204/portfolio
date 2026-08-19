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

**`framework` is `null` on purpose.** Left to detect, Vercel will apply a
preset, run a bundler, and publish its output directory. That build succeeds and
the site is broken: `assets/`, `robots.txt`, `sitemap.xml`, and
`site.webmanifest` never reach the output, because they are read at runtime
through absolute paths rather than imported, and a bundler only copies what it
can statically see. Every image and the CV would 404 under a green build log.

**`package.json` has no script named `build`.** Vercel zero-config runs a script
named exactly `build` if it finds one. Not having one removes the trigger
instead of fighting it. Vite was removed from `devDependencies` entirely for the
same reason — it existed only to serve files locally, which `tools/serve.ps1`
already does without Node.

**Do not add `buildCommand` or `outputDirectory`.** Either one puts Vercel into
build mode, where it collects output from a directory this project never
produces and publishes an empty deployment — a 404 on every path, with
`WARNING! Build output contains no "functions" or "static" directory` as the
only clue in the log.

## The site URL is hardcoded in three files

Static HTML has nowhere to put a variable, so the canonical URL appears in:

    index.html    canonical, og:url, og:image, and the JSON-LD url
    robots.txt    the Sitemap: line
    sitemap.xml   the <loc>

`og:image` has to stay absolute. Facebook, LinkedIn, and Slack resolve it
against nothing and will silently skip a relative path, so the preview would
just stop appearing with no error anywhere.

Changing domain means editing those, and nothing else:

```bash
grep -rln 'portfolio-beta-coral-24.vercel.app' index.html robots.txt sitemap.xml
```

Keep them truthful. A canonical tag pointing at a domain that does not resolve
is worse than having none: it can drop the live URL out of search results.

There is no custom domain, by choice: the project runs on Vercel's free tier and
`portfolio-beta-coral-24.vercel.app` is the real address. Every canonical tag,
`og:url`, `og:image`, and sitemap entry already points at it truthfully, so
nothing here is a placeholder waiting to be filled in.

If one is ever bought, adding it under Vercel's **Settings → Domains** plus the
edits above is the entire migration.

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

## Vercel Web Analytics

Enabled in the dashboard under **Analytics**, and wired into `index.html` with
the two script tags from Vercel's plain-HTML instructions. Page views and
visitors only — no cookies and no cross-site identifier, so no consent banner is
required.

The tracking script is served from this origin under `/_vercel/insights/`, a
route Vercel injects at deploy time. Two consequences:

- **The rewrite in `vercel.json` must keep excluding `_vercel/`.** Without that
  exclusion the catch-all answers the script request with `index.html`. Nothing
  errors; the dashboard simply never fills up.
- **It 404s on a local server**, because the route does not exist outside a
  Vercel deployment. `tools/serve.ps1` returns a clean 404 for `/_vercel/*` so
  the console shows a plain missing-resource line instead of a JavaScript parse
  error. That 404 is expected locally and does not appear in production.

To confirm it is working after a deploy, open the site and look for a Fetch/XHR
request to `/_vercel/insights/view` in the Network tab.

## The contact form

Posts to Web3Forms, which emails submissions to the address the access key is
registered against. The key lives in `js/core/config.js` and is public by
design — it can only send mail to that one inbox, and it is safe in a public
repository. There is no environment variable and nothing to configure in
Vercel.

## What is deployed

Everything in the repo, exactly as committed. That includes `js/vendor/`, which
holds GSAP — the site's one runtime dependency, committed rather than installed
because there is no install step in the deploy path. `docs/` and `tools/` are
also published; they are small, harmless, and nothing links to them.

There is no `reference/` folder any more. It held the original 3.2 MB design
prototype, which was removed once the design moved past it.
