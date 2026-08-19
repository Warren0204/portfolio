# Handoff

Everything a new machine — or a new assistant session — needs to pick this up.

## What this is

A personal portfolio for Warren Villagonzalo Gallardo: one HTML page, five
sections on a single scroll (Home, Projects, Experience, Credentials, Contact),
in plain HTML, CSS, and ES2022 modules. **No framework, no build step**, and one
vendored runtime dependency (GSAP). The source is what gets deployed.

- **Live:** <https://portfolio-beta-coral-24.vercel.app>
- **Repo:** `github.com/Warren0204/portfolio`, branch `main`

## Setting up on a new machine

```bash
git clone https://github.com/Warren0204/portfolio.git
cd portfolio
```

That is the whole install. The site needs no dependencies to run — only a static
server, because ES modules will not load over `file://`.

**Without Node** (this project was built on a machine that had none):

```powershell
powershell -File tools/serve.ps1     # http://localhost:5173
```

**With Node**, `npm install` fetches the dev tooling only — eslint, prettier,
stylelint. There is deliberately no dev server dependency: `tools/serve.ps1` is
it. Vite was removed because the only thing it did was serve files, and a real
`vite build` actively breaks this site (see DEPLOYMENT.md).

Then read [ARCHITECTURE.md](ARCHITECTURE.md) before changing code, and
[DEPLOYMENT.md](DEPLOYMENT.md) before changing anything about hosting.

## Rules that are not obvious from the code

**All user-facing copy lives in `js/data/`.** Components take text as data and
never contain it. The one exception is the loading screen, whose words are in
`index.html` because they must paint before any module loads.

**GSAP is loaded by classic `<script defer>` tags, not by an import.** The
vendored files are UMD, and a UMD wrapper evaluated as an ES module throws
`TypeError: Cannot set property window of #<Window> which has only a getter`.
`js/vendor/README.md` explains it. Converting those tags to imports will break
every animation on the page — this has already been tried once.

**No build step, and Vercel must be kept out of build mode.** `vercel.json` sets
`framework: null`, and `package.json` deliberately has no script named `build`.
Adding `buildCommand` or `outputDirectory` to `vercel.json` publishes an empty
deployment: a 404 on every path. This has happened twice. DEPLOYMENT.md explains
why.

**`vercel.json`'s rewrite must keep excluding `_vercel/`.** The catch-all
sends unknown paths to `index.html`, and Vercel Web Analytics lives under
`/_vercel/insights/*`. Drop that exclusion and the analytics script is answered
with the HTML page: no error anywhere, and the dashboard just stays empty.

**`vercel.json` cannot hold comments.** Vercel validates it against a schema and
rejects unknown keys, including the `"//"` convention that works in
`package.json`. Reasoning goes in DEPLOYMENT.md instead.

**Dependencies point one way:** `data → sections → components → core → vendor`.
A component never imports a section. Modules stay under about 150 lines.

**Adding content is a one-object data edit** — a project, a system, a diagram, a
certification, a skill group. See the table in ARCHITECTURE.md.

**The theme bootstrap is duplicated on purpose.** The inline script in
`index.html` mirrors `readStoredTheme()` in `js/components/themeToggle.js`,
because the attribute has to be set before first paint and module scripts are
too late. Change one, change the other.

## Environment traps that will waste your time

**The OS animation setting silences the whole motion layer.** If Windows has
animation effects off, Chrome reports `prefers-reduced-motion: reduce` and the
site correctly suppresses the preloader, the typewriter, every scroll reveal,
and the diagram draw-on. This is deliberate. Headless Chrome inherits the same
setting, so automated captures are affected too — force the query with
`Emulation.setEmulatedMedia` when testing motion, or you will screenshot a
static page and conclude the animation is broken.

**The loading screen runs once per browser session.** `sessionStorage` survives
a reload, so refreshing the same tab will never replay it. Use a new tab, a
private window, or clear storage over the DevTools protocol.

**A 404 on `/_vercel/insights/script.js` is expected locally.** Vercel injects
that path at deploy time, so it cannot exist on a local server. `serve.ps1`
answers it with a clean 404 rather than letting the index.html fallback hand
the browser HTML with a `.js` extension, which would log a parse error that
looks like a real bug. One 404 line per local page load is correct; the request
succeeds in production.

**`tools/serve.ps1` sends no cache headers**, so Chrome will happily reuse a
module it fetched before you edited it. When a change appears to do nothing,
disable the cache before concluding the change was wrong.

**Windows will not open a Chrome window narrower than about 484px**, so a real
phone width cannot be checked by dragging. `tools/shot.ps1` drives Chrome over
the DevTools protocol and can emulate any viewport:

```powershell
Start-Process chrome '--headless --disable-gpu --remote-debugging-port=9222 --user-data-dir=C:\Temp\cdp about:blank'
powershell -File tools/shot.ps1 -Width 390 -Height 844 -Scale 3 -Mobile -Out shot.png
```

Verify layout by looking at it. Measuring for overflow proves nothing about
whether a design is any good, and several early mobile passes were wrong
precisely because they were inferred from numbers rather than seen. Measuring
_is_ the right tool for overflow itself — the header's scrollbar collision at
834px was invisible in a screenshot and obvious in `getBoundingClientRect`.

## Git conventions

Commit messages are **two or three words**, and they name what changed rather
than what was touched. No scope prefixes, no conventional-commit types, no
trailing punctuation. **Do not add `Co-Authored-By` or any assistant
attribution** — every commit here is authored by Warren.

Two or three words is a real constraint, not a style note: if a message needs
more, the commit is doing more than one thing and should be split.

### The log so far

Read newest first. Use these as the pattern for anything new.

| Message                                     | What it covered                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Consolidate colour tokens`                 | 27 ad-hoc colours retired into tokens; 4 text levels folded to 2; 10 dead tokens removed                                                        |
| `Rebalance contact layout`                  | One grid for the whole section, routes card raised level with the heading                                                                       |
| `Add header chip`                           | Availability chip in the header from 1080px, reading the contact section's data                                                                 |
| `Add hCaptcha verification to contact form` | hCaptcha in front of the Web3Forms submit, rendered explicitly and lazily. Longer than the rule allows — kept because it was specified verbatim |
| `Readability and contact`                   | Light-theme ink re-tuned to 7:1, 11px type floor, dark by default, Contact routes rebuilt, NDA note added                                       |
| `Dedupe contact copy`                       | Removed repeated timezone, work arrangement, and contact details inside the Contact section                                                     |
| `Prune dead code`                           | Removed exports, modules, and CSS orphaned by the redesign; Home's third CTA now scrolls to Contact                                             |
| `Optimize images`                           | Logos and the certificate re-encoded to WebP, 1.73 MB down to 235 KB                                                                            |
| `Document domain decision`                  | Recorded that the site stays on the vercel.app URL, so it stops reading as unfinished work                                                      |
| `Phase 2 redesign`                          | Five sliding chapters became one scrolling page: GSAP motion, scroll-drawn diagrams, contact form, new wordmark                                 |
| `Phase 1 portfolio`                         | The original build                                                                                                                              |
| `Initial commit`                            | Repository created                                                                                                                              |

Verbs that fit the shape: `Add`, `Fix`, `Remove`, `Prune`, `Optimize`,
`Dedupe`, `Document`, `Rename`, `Restore`. A bare noun phrase is fine too when
the change is a thing rather than an action — `Phase 2 redesign`.

Messages that would be wrong here: `fix: resolve contact section duplication`
(prefix, too long), `Updated files` (says nothing), `Various improvements`
(hides a commit that should have been several).

Pushes to `main` deploy to production automatically; pull requests get preview
deployments.

## Still outstanding

**Image weight.** `assets/img/credentials/google-ai-professional.jpg` is 971 KB
and the logo PNGs total roughly 800 KB. Nothing is broken, but re-encoding them
as WebP is the single biggest performance win left on this site.

## Decided, so nobody re-opens it

**The site stays on `portfolio-beta-coral-24.vercel.app`.** A custom domain
costs money and this project is deliberately on the free tier. The vercel.app
URL is the real address, and every canonical tag, `og:url`, `og:image`, and
sitemap entry points at it truthfully — which is the only thing that actually
matters for search. This is a settled decision, not a gap.

If a custom domain is ever bought, the whole migration is: add it under Vercel's
**Settings → Domains**, then update the URL everywhere it is hardcoded, because
static HTML has nowhere to put a variable:

```bash
grep -rln 'portfolio-beta-coral-24.vercel.app' index.html robots.txt sitemap.xml
```

Do that in one pass. A canonical tag pointing at a domain that does not resolve
is worse than having none — it can drop the live URL out of search results.
