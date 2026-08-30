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
stylelint. Node 24 has been on this machine since 2026-08-30, so `npm ci`,
`npm run lint`, and `npm run format:check` all work here; run them before a
commit. There is deliberately no dev server dependency: `tools/serve.ps1` is
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

**Safe-area insets can be emulated, and viewport height cannot.**
`Emulation.setSafeAreaInsetsOverride` over the DevTools protocol makes
`env(safe-area-inset-*)` resolve to real values in headless Chrome, so the
landscape-cutout rules can be checked without a notched phone. Browser chrome
is the opposite: an emulated viewport has none, so the `height` media feature
reads 50-100px taller than the same device reports in a real browser. Never
pick a height breakpoint from an emulated viewport — `(height < 470px)` in
`layout/page.css` is chosen against initial-containing-block sizes, and the
comment there explains why the number is not the one a screen spec suggests.

**`tools/serve.ps1` is PowerShell only.** On Linux or macOS,
`python3 -m http.server 5173` serves the site the same way; the only thing
lost is the clean 404 on `/_vercel/insights/script.js`.

**`tools/serve.ps1` will not start under the default execution policy.** This
machine reports `Restricted` at every scope, so `powershell -File` refuses the
script before it runs. Start it with a process-scoped bypass, which changes
nothing on the system:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/serve.ps1     # http://localhost:5173
```

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

### 2026-08-30: the Phase 2 pass

A run of small commits from one recon report (`recon-report.md`, kept out of
the repo), landed in three batches and one follow-up and checked on localhost
between batches.

What changed: the phone hero is a centred 132px circle in the brand ring with
the intro under it; the portrait paints without an entrance tween and is
preloaded from the head. Touch targets clear 44px everywhere, the submit
button fills the column on a phone, new-tab links carry a glyph and
`noreferrer`, and text links are underlined. Experience opens on an Overview
token inside the role card, with the three systems as segmented tokens; the
TranspiraFund surfaces use the same control and gained an AI layer token.
Projects is a numbered list of two cards, the capstone and a DataCamp guided
project, each closing behind a hairline, with a sticky identity strip on
phones. Copy went sentence case in the data with uppercase kept in CSS.
Dark-mode accents are desaturated. Two font families instead of four. Dead
CSS, tokens and data pruned.

Why: the recon found the portrait left-anchored with half the column empty on
every real phone, the primary action below the fold, the systems hidden behind
tag-like tabs, and no visible boundary between one project and the next.

Decisions, so nobody re-opens them:

- D1 Phone hero: a centred circle, capped at 132px so the 400px source is never upscaled, portrait first in the column.
- D2 Machine voice: uppercase tracked labels stay, applied by CSS; the data is sentence case.
- D3 Fonts: Sora 600 and 700 plus Hanken Grotesk 400, 500 and 600, and nothing else; IBM Plex Mono and Instrument Serif dropped.
- D4 DataCamp card: second in the list, tag Guided project, chips SQL, PostgreSQL and DataCamp DataLab, badge Completed in green, link Open notebook with the external glyph.
- D5 Dark accents: the desaturated set from the recon, every ink still above 8:1 on its ground.
- D6 TranspiraFund tokens: the same segmented control; an AI layer surface holds only the existing items that named Claude, retrieval, or verification.
- D7 Experience default: Overview first; token labels only, no counts.
- D8 Contact ending: the details line stays the close; the footer is a contentinfo landmark, and on a phone the form comes before the routes.

Left open at the time, and closed by the follow-up pass below: fallback font
metrics needed measured values; `tools/og-card.html` still named the old faces;
the `serif-tail` class name had outlived the serif.

### 2026-08-30: the follow-up pass

The Phase 2 commits were checked before anything else was added: `npm run
lint` clean, no console errors, no horizontal overflow, and no stuck reveals
at 320, 360, 390, 412, 430, 768, 1280 and 1440 wide plus 852x393 landscape, in
both themes, driven over the DevTools protocol against `tools/serve.ps1`. Three
Phase 2 modules were left unformatted and were run through Prettier. A review
of the range then found one real regression and two gaps, all fixed below.

What changed: the headline tail is upright — Sora has no italic, and the
`<em>` default had been slanting it synthetically. Four metric-matched
fallback faces (local Arial with Hanken's and Sora's own metrics laid over it)
sit behind the two families, so the first paint and the web-font paint share
one geometry: with the font requests blocked, the hero headline, summary,
actions and stats land at the same pixel rows as with the fonts, at 390 and at
1280 wide. `tools/font-metrics.js` reproduces the numbers. The lightbox bar
on a phone is 104px, down from 135. The DataCamp card's link is a 44px row.
The OG card source uses the two families and the current dark tokens, and
`og-cover.jpg` was regenerated from it. The contact form reveals on its own
trigger. The TranspiraFund surfaces panel is named by its token. The AI layer
token has its own caption. README, ARCHITECTURE and a tokens comment say what
the code now does.

Why the contact fix mattered: Phase 2 moved the routes card below the form on
a phone with `order`, but the form's reveal was still keyed to that card. On
a real phone with motion enabled the whole form sat at opacity 0 while it was
the thing on screen, until the card a full screen further down came into
view. Measured: at 390x844 the form occupied 101 to 816px of the viewport and
was invisible.

Decisions, continuing the numbering above:

- D9 Tail: upright. A synthesised oblique is a face the site does not load; the emphasis is the accent colour and the 600 weight step. One line in typography.css reverts it.
- D10 Fallback faces: Arial only, because it is on every Windows, macOS and iOS device and its metrics could be measured here. No Android stand-in: Roboto was not on this machine to measure, and a wrong size-adjust is worse than none. Self-hosting was not taken; it remains the larger win and is listed below.
- D11 The AI layer caption: "Milestone planning and photo verification under both surfaces", built from the summary's own words rather than a new claim.

Left open: the uppercase copy still in the data (see Still outstanding), and
the residual layout shift below the fold that an average-width match cannot
remove (also below).

### 2026-08-30: the tab bar redesign

The phone bottom navigation only. Each tab was a numeral over a label with a
lit rail above the current one; it is now an icon in a pill over the label,
the way a native tab bar marks place. The show condition, the z-index, the
nav's aria-label, and the scroll-spy and router wiring are unchanged, and
nothing at 920px and wider moved. Checked without a browser: lint and
Prettier clean, label widths computed from the Hanken advance widths, and the
new glyphs' winding checked by shoelace.

What changed: the bar is 64px plus the home-indicator inset (56px on a phone
held sideways), in the header's translucent recipe with a 0.16 hairline and
no shadow, and --tab-bar-space reserves exactly that box. Each tab is a
full-height column, 63px under the hairline, with a 56x32 pill holding a 24px
glyph and an 11px Hanken label. The current tab fills the pill with the
accent at 0.14 (0.2 in dark) and sets icon and label in the accent ink; a
section already read keeps its icon in the text colour. The pill scales to
0.94 on press, and not under reduced motion. aria-current is "page". Four
glyphs joined icon.js (house, folder, briefcase, award); Contact reuses the
envelope.

Decisions, continuing the numbering above:

- D12 Label size: 11px, and 10.5px below 360px only. Credentials measures 57px at 11px against 56px of room in a 320px tab; at 10.5px it is 55.
- D13 Sideways: the bar is 56px and the tab's block padding halves to 4px, because 55px under the hairline holds the pill, the gap and the label with nothing to spare.
- D14 Contact's glyph is the existing envelope. A second envelope would have been the same drawing under a new name.
- D15 The pill tint is a token, --tab-bar-pill, with its light and dark values in tokens.css, so no component file branches on the theme.
- D16 The focus ring is the site's own, drawn 4px inward, so it never runs off the bottom of a screen that has no inset.
- D17 The press is the pill's own 0.94 rule rather than the 0.985 recipe in utilities/touch.css, which scales a whole control.

### 2026-08-30: projects parity, contact tidy, desktop smooth scroll

Twelve commits from one recon report (`recon-2026-08-30.md`, kept out of the
repo), run one batch per reply and checked on localhost between each. Projects,
the Contact ending, and the two hero calls to action. Experience and Credentials
were not touched.

What changed: the identity chips lost their numbers and the middot with them,
and the 74ch reading measure moved off `.project__header` onto its three text
children, so the identity line spans the card content box on both cards instead
of stopping at the measure on one of them. Below 440 that line is two
deterministic rows: chip and rule, then the date left under it. The TranspiraFund
stack is five sentence-case groups and 24 chips, rendered without product marks.
The compact card's footer reads badge left, link right. The DataCamp link lost
its trailing `/edit`. Contact lost its footer entirely, so the routes card closes
the page, and the availability card fills the column below 900. The two hero
actions navigate through the router rather than through the browser's fragment
step, and the modified-click guard the header and the tab bar each carried is now
one export in `js/core/dom.js`. Every em dash in a user-facing string is gone.

Left open: the comments and the docs prose still carry em dashes, and the hero
availability signal is deferred rather than dropped. Both are below.

Decisions, continuing the numbering above:

- D18 Project numerals removed, and the middot separator with them: two cards are not a sequence, so `01` and `02` carried no information. `padCount` stays in core/format.js, because Experience still numbers its systems.
- D19 The 74ch measure moved off `.project__header` onto its title, summary and roles. The header also holds the identity line, which is why one card's line stopped at the reading measure while the other ran to the card edge.
- D20 Below 440 the identity line is two rows on both cards, stated as `flex: 1 0 100%` on the date rather than left to wrap. Wrapping depended on how long each card's own chip and date happened to be, so the two disagreed at 320, 360 and 390.
- D21 Badge left, link right, in a card footer that carries both. The case study footer holds only its status block, so there is nothing there for the convention to order and it was left alone.
- D22 The DataCamp URL is the notebook without the trailing `/edit`, so a logged-out visitor lands on the notebook rather than an editor. Supersedes that part of D4.
- D23 Contact's byline and its whole footer are gone, landmark included; the routes card closes the page and there is no `contentinfo` on the site any more. Supersedes D8. A colophon with a source link was built in `1e2810c` and removed in `4d71085` inside this same session, so neither commit is live work.
- D24 The availability card fills the column below 900 through one declaration, `justify-self: stretch`. `display` needed no change: a grid item is blockified, so the `inline-flex` above it already computed to `flex`.
- D25 The hero availability signal is deferred, not dropped. Below 440 the portrait is 128px wide at a 320 viewport, and `CEBU CITY, PHILIPPINES` alone needs a 204px figure to stay on one line, so a dot plus "Open to work" cannot share that row.
- D26 The two hero actions route through `onNavigate`, as the header nav and the tab bar always have. They stay real links and only a plain left click is taken over. `isModifiedClick` is one export in `js/core/dom.js` rather than three copies, and `chapterById` retired with the change.
- D27 `stackGroups` is five sentence-case groups and 24 chips, which clears D2 for that data. Marks are off in that block through a `mark: false` option on `createChip`: only two labels were in the logo map, and a mark on those two singled them out for a reason a reader cannot infer. SDKs, CLIs, build tooling, secret storage, Zod and sharp came out as plumbing that other chips already imply. `ae0c8a5`, `c5606e8`, `363498c`.
- D28 Every em dash in a user-facing string is now a middot or a full stop: ten of them, across `index.html`, `js/data/navigation.js` and `js/data/profile.js`. `acd9e28`. Comments and docs prose were deliberately left, and are on the outstanding list.
- D29 The role line under "Team of four" is prose, not the mono label recipe beside it: family, size and tone are the summary's, because it is a sentence and that recipe is for three words. It sits on its own row inside the roles row through a 100% flex basis, and inside the same 74ch measure as the title and the summary.

### The log so far

Read newest first. Use these as the pattern for anything new.

| Message                                     | What it covered                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Add role line`                             | One sentence under "Team of four" on how the team was run, set as prose inside the roles row                                                     |
| `Update handoff log`                        | This entry                                                                                                                                       |
| `Route hero actions`                        | The two hero calls to action navigate through the router; `isModifiedClick` hoisted into core/dom.js and `chapterById` retired                   |
| `Remove contact footer`                     | The footer goes entirely, landmark included; the routes card closes the page                                                                     |
| `Widen availability card`                   | `justify-self: stretch` below 900, so the card shares the form fields left edge and width                                                        |
| `Replace footer byline`                     | A colophon and a source link, superseded by `Remove contact footer` in the same session                                                          |
| `Reorder card footer`                       | Badge left and link right on the compact card; the link stays inside its paragraph so the underline survives                                     |
| `Widen identity line`                       | The 74ch measure moved onto the header text children, and a two-row identity line below 440                                                      |
| `Drop project numerals`                     | `01` and `02` and the middot out of the identity chips, and the index argument out of four modules                                               |
| `Sweep visible dashes`                      | The ten em dashes in user-facing strings become middots and full stops                                                                           |
| `Drop sharp chip`                           | `sharp (photo stamping)` out of the Backend group                                                                                                |
| `Fix notebook link`                         | The DataCamp URL loses its trailing `/edit`                                                                                                      |
| `Drop stack marks`                          | A `mark: false` option on `createChip`, so the BUILT WITH block renders as plain text                                                            |
| `Rewrite stack groups`                      | Five sentence-case groups replacing four uppercase ones on the TranspiraFund card                                                                |
| `Update handoff log`                        | The tab bar redesign entry                                                                                                                       |
| `Redesign tab bar`                          | Icon pills over labels in a 64px translucent bar; numerals and rail gone; the pill is the indicator and a visited icon takes the text colour     |
| `Add nav icons`                             | House, folder, briefcase and award glyphs on the 24 grid, and an `icon` field per chapter; Contact reuses the envelope                           |
| `Update handoff log`                        | The follow-up pass entry                                                                                                                         |
| `Correct stale notes`                       | README's Projects row, ARCHITECTURE's shell and content tables, and the brand-gradient comment in tokens.css, each saying what the code does now |
| `Caption AI layer`                          | The AI layer token carried the Shared foundation caption; it now has its own, in the summary's words                                             |
| `Name surfaces panel`                       | The TranspiraFund tabpanel takes `aria-labelledby` from the selected token, as the Experience and Credentials panels already did                 |
| `Fix contact reveal`                        | The form and the routes card each reveal on their own trigger; the shared one sat below the fold on a phone and held the form invisible          |
| `Refresh OG card`                           | `tools/og-card.html` in the two families and the current dark tokens; `og-cover.jpg` regenerated from it                                         |
| `Compact zoom bar`                          | The lightbox bar on a phone: eyebrow hidden below 700px and block padding on the scale, 135px down to 104                                        |
| `Raise link target`                         | The compact card's Open notebook link is a 44px row, the one target on the page that was still under the floor                                   |
| `Add fallback faces`                        | Four metric-matched local Arial stand-ins behind Hanken and Sora; the hero no longer moves when the web fonts land                               |
| `Add metrics tool`                          | `tools/font-metrics.js`: reads head, hhea, OS/2, cmap and hmtx from a TTF and prints size-adjust and the three overrides                         |
| `Keep tail upright`                         | `font-style: normal` on the headline tail; Sora has no italic and the `<em>` default was a synthesised slant                                     |
| `Rename tail class`                         | `serif-tail` is `display-tail`; the serif left in the font consolidation                                                                         |
| `Format sections`                           | Prettier over the three modules the Phase 2 pass left unformatted                                                                                |
| `Update handoff log`                        | The Phase 2 pass entry                                                                                                                           |
| `Mark visited tabs`                         | A section already read keeps a faint trace of the marker in the phone tab bar                                                                    |
| `Prune dead code`                           | Card, tab, dot and eyebrow variants with no consumer, two z-index tokens, unread system summaries; the cue keyframes moved to animations.css     |
| `Consolidate fonts`                         | Two families from Google Fonts instead of four; labels are Hanken in the label recipe; the serif tail is Sora 600; body 16px                     |
| `Desaturate dark accents`                   | Dark accent, green and red inks about 15 percent less saturated, each still above 8:1 on its ground                                              |
| `Group project cards`                       | Both projects in one card shell with a numbered identity line and a hairline footer; a sticky identity strip on phones                           |
| `Snap spacing scale`                        | Off-scale paddings and gaps moved to tokens; the section gap tighter on phones; eyebrows closer to what they label                               |
| `Tidy contact ending`                       | The footer is a contentinfo landmark; on a phone the form comes before the routes; a tighter footer gap                                          |
| `Tidy microcopy`                            | Sentence case in the data with uppercase kept in CSS; shorter hints and labels; nav labels uppercased by the stylesheet                          |
| `Add DataCamp card`                         | A compact card for the guided project, second in the list, with its notebook link and a Completed badge                                          |
| `Add segmented tabs`                        | Experience opens on an Overview token inside the role card; TranspiraFund surfaces use the same control and gain an AI layer token               |
| `Tighten nested radii`                      | Chip logos and the certificate thumb no longer rounder than the container they sit in; chip borders one step lighter                             |
| `Flatten gradients`                         | The frame wash, section hairline and scroll cue are flat tints; the ambient wash, portrait ring and progress bar remain                          |
| `Retire pure white`                         | Near-white and near-black tokens where #fff and rgba(0, 0, 0) were, except the white logo ground                                                 |
| `Add link glyphs`                           | External and download icons as inline SVG, noreferrer on every new-tab link, underlined text links in running copy                               |
| `Raise touch targets`                       | Availability chip, tabs, zoom buttons, skip link and primary buttons at or above 44px; full-width submit on a phone; focusable diagram scroller  |
| `Center phone portrait`                     | The phone hero as a centred circle in the brand ring, portrait first, preloaded from the head, no entrance tween; hero logo chips eager          |
| `Add thumbnail source`                      | An 800px credential thumbnail behind `srcset`/`sizes`; a client at DPR 2 or less takes 48KB where it used to take 188KB                          |
| `Fix modal lock`                            | The scroll lock named body and so never reached the viewport; the zoom body now fills its dialog, so the certificate centres on a phone          |
| `Raise touch targets`                       | Tab buttons and the wordmark to the 44px floor through `.target`; nav links get a 44px hit area without a 44px box, so the underline stays put   |
| `Shrink landscape portrait`                 | The hero portrait and its grid track sized from viewport height on a phone held sideways, where the frame was taller than the screen             |
| `Cap dialog height`                         | `min(88svh, 100%)`, so a dialog cannot be taller than the screen it is centred in once the backdrop's own padding is counted                     |
| `Inset for cutouts`                         | One rule answering `env(safe-area-inset-left/right)` for the header, tab bar, well and dialogs, via an `--edge-pad` each states for itself       |
| `Key shell to height`                       | The phone shell keyed to a short touch screen as well as a narrow one, so a landscape phone keeps its tab bar instead of taking the desktop nav  |
| `Unstick credentials tabs`                  | The Credentials tab strip was sticky underneath the header and never once visible; it sits in normal flow now                                    |
| `Drop SQL chip`                             | Hero tech stack down to seven; SQL is still claimed in the Credentials data group, where it reads alongside PostgreSQL and DAX                   |
| `Center frame caption`                      | A caption narrower than its own text centres both lines instead of ragging left inside a centred block                                           |
| `Stack hero actions`                        | One action per row below 560px, so the hierarchy is carried by weight rather than by width                                                       |
| `Rebalance hero grid`                       | A third hero arrangement from 440px: portrait beside the headline, body across both columns. Fixes the orphaned portrait and the clipped chips   |
| `Reserve tab bar`                           | `--tab-bar-space`, reserved once on `.stage`, replacing the bar-aware padding that only Contact had                                              |
| `Consolidate colour tokens`                 | 27 ad-hoc colours retired into tokens; 4 text levels folded to 2; 10 dead tokens removed                                                         |
| `Rebalance contact layout`                  | One grid for the whole section, routes card raised level with the heading                                                                        |
| `Add header chip`                           | Availability chip in the header from 1080px, reading the contact section's data                                                                  |
| `Add hCaptcha verification to contact form` | hCaptcha in front of the Web3Forms submit, rendered explicitly and lazily. Longer than the rule allows — kept because it was specified verbatim  |
| `Readability and contact`                   | Light-theme ink re-tuned to 7:1, 11px type floor, dark by default, Contact routes rebuilt, NDA note added                                        |
| `Dedupe contact copy`                       | Removed repeated timezone, work arrangement, and contact details inside the Contact section                                                      |
| `Prune dead code`                           | Removed exports, modules, and CSS orphaned by the redesign; Home's third CTA now scrolls to Contact                                              |
| `Optimize images`                           | Logos and the certificate re-encoded to WebP, 1.73 MB down to 235 KB                                                                             |
| `Document domain decision`                  | Recorded that the site stays on the vercel.app URL, so it stops reading as unfinished work                                                       |
| `Phase 2 redesign`                          | Five sliding chapters became one scrolling page: GSAP motion, scroll-drawn diagrams, contact form, new wordmark                                  |
| `Phase 1 portfolio`                         | The original build                                                                                                                               |
| `Initial commit`                            | Repository created                                                                                                                               |

Verbs that fit the shape: `Add`, `Fix`, `Remove`, `Prune`, `Optimize`,
`Dedupe`, `Document`, `Rename`, `Restore`. A bare noun phrase is fine too when
the change is a thing rather than an action — `Phase 2 redesign`.

Messages that would be wrong here: `fix: resolve contact section duplication`
(prefix, too long), `Updated files` (says nothing), `Various improvements`
(hides a commit that should have been several).

Pushes to `main` deploy to production automatically; pull requests get preview
deployments.

## Still outstanding

**Two images are capped by their sources, not by the code.**
`assets/img/portrait.webp` is 400x400 and that is the original. The 4:5 hero
frame keeps 320x400 of it, so the sharpest honest display is 320 CSS px at 1x —
and a phone at DPR 3 wants 960. `assets/img/og/og-cover.jpg` carries the same
face at roughly 292x370 and JPEG-compressed, so it is not a second source.
`assets/img/logos/university-of-cebu.webp` has the same problem from the other
end: 180x180 against a crest that pins to its 84px floor on every phone and
wants 252 device pixels there. Upscaling either produces bytes, not detail.
**Both need a higher-resolution original before anything else is worth doing.**

**Self-hosting the fonts is the remaining font win.** The metric-matched
fallbacks stop the swap from moving the first screen, but the swap itself
still happens, and it costs a round trip to fonts.googleapis.com and another to
fonts.gstatic.com before either family can paint. Both families are served as
variable fonts — one woff2 per family for the Latin range — so self-hosting is
two files under `assets/`, two `@font-face` blocks, and two `<link
rel="preload">` tags, with the fallback faces staying as they are. Both are
OFL-licensed. The reason it was not done: it changes what the CDN cache and the
Google Fonts versioning do for free, and that is a decision for the owner.

**A little layout still shifts below the fold when the fonts land.** The
fallback faces match the web faces on average width, not word by word, so a
line here and there still wraps differently: measured with the font requests
blocked, the hero is identical, but the evidence strip at 1280 wide is 19px
taller in the fallback and the Projects section at 390 wide about 54px taller.
Both are out of the first viewport, so they cost nothing on the metric that
matters; closing them would mean per-string tuning or self-hosting.

**The data still carries uppercase copy.** D2 says the data is sentence case
and the stylesheet does the uppercasing, and that holds for the nav, the
Experience tokens, the microcopy the pass touched and, from this session, the
project stack group labels. It does not yet hold for
the eyebrows (`CONTACT`, `SEND A MESSAGE`, `EDUCATION`), the availability
status, the stat labels, the scroll cue, the theme labels or the Credentials
tab labels. The eyebrow and label recipes already apply
`text-transform: uppercase`, so most of those could go sentence case with no
visible change; the Credentials tab strip has no uppercase rule of its own, so
its labels would change look and need the rule first. A data-only sweep, one
commit.

**Em dashes are gone from the copy but not from the code.** The rule is that
none appear anywhere, and a tokenizer count across every tracked file outside
`js/vendor/` splits them three ways. The ten in user-facing strings are closed,
at `acd9e28`. What remains is 161 in comments across 52 files, heaviest in
`css/layout/page.css`, `css/base/tokens.css` and `css/sections/home.css`, and 51
in the prose of `README.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md` and
this file, which holds 18 of them while carrying the rule. Include
`js/components/header.js:1`, which still opens "The fixed section bar" for a
header that is sticky. Two sweeps, one for comments and one for docs, neither
touching behaviour.

**The README has not been read since the repo went public.** Nothing on the site
links to it, but the repository is public and the source is reachable, so it is
read by anyone who looks. It has not been checked against what the code now does
in this session or the two before it.

**The tab title and the hero copy have not been reviewed against the lanes being
targeted.** Both say "Power Platform Developer and Data Analyst", in
`index.html:15`, `index.html:25`, `js/data/navigation.js:16` and
`js/data/profile.js:10`. That is accurate for what has shipped and it is not
obviously the phrase an AI automation or junior AI engineer search is looking
for. It is a copy and positioning decision, not a code change, and it wants its
own session.

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
