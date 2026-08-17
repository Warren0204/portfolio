# Handoff

Everything a new machine — or a new assistant session — needs to pick this up.

## What this is

A personal portfolio for Warren Villagonzalo Gallardo: one HTML page, five
hash-routed chapters (Home, Projects, Experience, Credentials, Contact), in
plain HTML, CSS, and ES2022 modules. **No framework, no runtime dependencies,
and no build step.** The source is what gets deployed.

- **Live:** <https://portfolio-beta-coral-24.vercel.app>
- **Repo:** `github.com/Warren0204/portfolio`, branch `main`

## Setting up on a new machine

```bash
git clone https://github.com/Warren0204/portfolio.git
cd portfolio
```

That is the whole install. The site needs no dependencies to run — only a
static server, because ES modules will not load over `file://`.

**With Node:**

```bash
npm install     # dev tooling only: vite, eslint, prettier, stylelint
npm run dev     # http://localhost:5173
```

**Without Node** (this project was built on a machine that had none):

```powershell
powershell -File tools/serve.ps1     # http://localhost:5173
```

Then read [ARCHITECTURE.md](ARCHITECTURE.md) before changing code, and
[DEPLOYMENT.md](DEPLOYMENT.md) before changing anything about hosting.

## Rules that are not obvious from the code

**All user-facing copy lives in `js/data/`.** Components take text as data and
never contain it. The one exception is the loading screen, whose words are in
`index.html` because they must paint before any module loads.

**No build step, and Vercel must be kept out of build mode.** `vercel.json`
sets `framework: null`, and `package.json` deliberately has no script named
`build` — it is `build:dist`. Adding `buildCommand` or `outputDirectory` to
`vercel.json` publishes an empty deployment: a 404 on every path. This has
happened twice. DEPLOYMENT.md explains why.

**`vercel.json` cannot hold comments.** Vercel validates it against a schema and
rejects unknown keys, including the `"//"` convention that works in
`package.json`. Reasoning goes in DEPLOYMENT.md instead.

**Dependencies point one way:** `data → sections → components → core`. A
component never imports a section. Modules stay under about 150 lines.

**Adding content is a one-object data edit** — a project, a system, a
certification, a skill group. See the table in ARCHITECTURE.md.

## Environment traps that will waste your time

**The OS animation setting silences the whole motion layer.** If Windows has
animation effects off, Chrome reports `prefers-reduced-motion: reduce` and the
site correctly suppresses the break-apart, the typewriter, the pulses, and the
chapter slides. This is deliberate. Headless Chrome inherits the same setting,
so automated captures are affected too — force the query with
`Emulation.setEmulatedMedia` when testing motion.

**The loading screen runs once per browser session.** `sessionStorage` survives
a reload, so refreshing the same tab will never replay it. Use a new tab or a
private window.

**Windows will not open a Chrome window narrower than about 484px**, so a real
phone width cannot be checked by dragging. `tools/shot.ps1` drives Chrome over
the DevTools protocol and can emulate any viewport:

```powershell
Start-Process chrome '--headless --disable-gpu --remote-debugging-port=9222 --user-data-dir=C:\Temp\cdp about:blank'
powershell -File tools/shot.ps1 -Width 390 -Height 844 -Scale 3 -Mobile -Out shot.png
```

Verify layout by looking at it. Measuring for overflow proves nothing about
whether a design is any good, and several early mobile passes were wrong
precisely because they were inferred from numbers rather than seen.

## Git conventions

History is a single squashed commit, `Phase 1 portfolio`, authored by Warren.
Commit messages are short — two or three words. **Do not add `Co-Authored-By`
or any assistant attribution.** Normal incremental commits are fine from here.

Pushes to `main` deploy to production automatically; pull requests get preview
deployments.

## Still outstanding

**`warrengallardo.dev` is not registered.** Once it is, add it under Vercel's
Settings → Domains, and update the site URL in the three files that hardcode
it, because static HTML has nowhere to put a variable:

```bash
grep -rln 'portfolio-beta-coral-24.vercel.app' index.html robots.txt sitemap.xml
```

Keep those truthful: a canonical tag pointing at a domain that does not resolve
can drop the live URL out of search results.

**No Open Graph image.** `assets/img/og/` is empty; a 1200x630 `og-cover.jpg`
would improve link previews. The `og:image` tag is deliberately absent rather
than pointing at a missing file.

## The design reference

`reference/prototype.html` is the original design mockup, vendored and **not
shipped**. It is the source of truth for layout, colour, copy, and interaction.
Open it in a browser to see the intended design. `reference/unbundle.ps1`
regenerates its readable form. No shipped code imports from it.
