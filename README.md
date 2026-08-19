# Warren Gallardo — Portfolio

Welcome. This is the source for my personal portfolio site.

**Live at [portfolio-beta-coral-24.vercel.app](https://portfolio-beta-coral-24.vercel.app)**

I am a Power Platform developer and data analyst based in Cebu City. I put
automation and reporting into a company's live operations, then document and
hand them over so they keep running without me.

## What's inside

One page, five sections, read top to bottom:

| Section         | What it covers                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Home**        | Who I am, what I do, and the numbers behind it                                                                    |
| **Projects**    | TranspiraFund — a monitoring platform built and validated with a city engineering office                          |
| **Experience**  | The Benchmark365 internship, and the three systems I shipped into production there, each with its process diagram |
| **Credentials** | My degree, certifications, the four tracks I am building in, and the skills underneath                            |
| **Contact**     | A message form, and the direct routes for anyone who would rather not use it                                      |

Everything is written in plain HTML, CSS, and JavaScript — no framework and no
build step. The one runtime dependency is GSAP, which drives the scroll
animation, and it is committed to the repo rather than installed. Light and dark
themes, following your system until you say otherwise, and built for a phone as
much as a desktop.

The three process diagrams in Experience are not images. They are node-and-edge
data rendered to SVG, and each one draws itself in execution order as you scroll
through it.

## Running it locally

No dependencies are needed to run the site — only a static server, because ES
modules will not load from the filesystem.

```powershell
powershell -File tools/serve.ps1     # http://localhost:5173
```

With Node available, `npm install` fetches the linters and formatter only.

Contributors should read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before
changing code and [docs/HANDOFF.md](docs/HANDOFF.md) for the things that are not
obvious from it.

## Get in touch

- **Email** — warrengallardo0204@gmail.com
- **LinkedIn** — [warren-gallardo](https://www.linkedin.com/in/warren-gallardo/)
- **GitHub** — [Warren0204](https://github.com/Warren0204)
