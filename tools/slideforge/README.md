# slideforge

A small CLI that generates the cover slides and end-of-review summary
artwork for blog reviews on In-ear Gems. Reads a flat JSON config from
`assets/images/<product>/slideforge.json`, runs Slidev + Chart.js to
render the slides, and writes `slide_1.png` … `slide_N.png` next to the
source photos. The writer agent (or Gen) drives the build incrementally via
subcommands — no monolithic config to fill in upfront.

The tool isolates itself from the Jekyll site. It lives under
`tools/slideforge/`, depends only on Node, and never touches the host
site's `_config.yaml` or build pipeline.

## What's in the box

```
tools/slideforge/
├── package.json                # slidev + vue-chartjs + chart.js + playwright-chromium
├── bin/slideforge.mjs          # CLI entry (parses args, dispatches subcommands)
├── src/                        # all the tool's logic
│   ├── config.mjs              # JSON schema + validation
│   ├── commands.mjs            # init, set, add/remove section, build, show, clean, example
│   ├── section-types.mjs       # registry of archetype types
│   ├── markdown.mjs            # turns the config into a slides.md
│   ├── runner.mjs              # copies templates, runs slidev export
│   └── help.mjs                # usage text
├── templates/                  # static files copied into every scratch dir
│   ├── style.css               # global styles (overlays, logo, rating, charts)
│   ├── vite.config.js          # injects style.css into the slidev page
│   ├── slide-bottom.vue        # global-bottom layer (the logo)
│   └── components/
│       ├── RatingBar.vue       # ★★★★★ with optional seal
│       └── DimensionRadar.vue  # 4-axis chart.js radar
├── examples/                   # ready-to-copy sample configs
└── scratch/                    # transient slidev projects (one per build)
```

## Prerequisites

- Node.js 20+ (developed against Node 25).
- Chromium binary reachable by Playwright. `playwright-chromium` is a dep
  and installs its own Chromium, so no system Chrome is needed.
- No global install. Everything runs from `node bin/slideforge.mjs`.

## Install

```sh
cd tools/slideforge
npm install
```

## Usage

The CLI is incremental — the writer agent (or Gen) calls it step by step
as the inputs become known, validating each step before moving on.

### Quick start (the full agent flow)

```sh
# 1. Create the initial config (product name + image dir + hero photo + FR graph)
node tools/slideforge/bin/slideforge.mjs init Performer8s \
  --product "AFUL Performer 8S" \
  --background IMG_20260706_144556987.jpg \
  --graph graph.png

# 2. Add the text content
node tools/slideforge/bin/slideforge.mjs set tagline Performer8s --text "Convoy from Jupiter"
node tools/slideforge/bin/slideforge.mjs set summary Performer8s --text "A flagship single-DD with pristine technicalities and a warm signature."

# 3. Add the four rating dimensions (one call per dimension)
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Timbre and Tonality" --score 3.5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Bass and Dynamic"    --score 5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Resolution"            --score 4.5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Soundstage and Imaging" --score 5

# 4. Add cover sections (one per archetype block)
node tools/slideforge/bin/slideforge.mjs add section Performer8s --type design-vision       --images vendor_quote.jpg
node tools/slideforge/bin/slideforge.mjs add section Performer8s --type packaging           --images IMG_...301747.jpg,IMG_...322332.jpg
node tools/slideforge/bin/slideforge.mjs add section Performer8s --type frequency-response --images graph.png

# 5. Build the deck
node tools/slideforge/bin/slideforge.mjs build Performer8s
# → 4 PNGs at assets/images/Performer8s/slide_{1,2,3,4}.png
```

A bare `<imageDir>` like `Performer8s` is resolved to
`assets/images/Performer8s/` relative to the cwd. Pass `./foo` or an
absolute path to override.

### Other subcommands

| Command | Purpose |
|---|---|
| `slideforge show <imageDir>` | Pretty-print the current `slideforge.json` |
| `slideforge serve <imageDir> [--port N] [--open]` | Spin up the slidev dev server against the generated slides. Preview in a browser, no PNGs written. |
| `slideforge example <imageDir>` | Drop a `slideforge.example.json` template into `<imageDir>` |
| `slideforge clean <imageDir> [--scratch]` | Remove generated `slide_*.png` from `<imageDir>`. With `--scratch`, also remove the slidev build/serve scratch dirs (`scratch/_build_*` and `scratch/_serve_*`). |
| `slideforge remove section <imageDir> --index <n>` | Delete a section by 0-based index. Use `--last` to drop the trailing section. |
| `slideforge set <field> <imageDir> --unset` | Remove a `tagline`, `summary`, or `graph` field; for `rating`, removes a single dimension (`--dimension "X"`). The whole `rating` object is dropped when the last dimension is removed. |

Run `slideforge --help` for the full flag list.

## Config schema

The schema is enforced by `src/config.mjs`. The full file:

```jsonc
{
  "metadata": {
    "product": "AFUL Performer 8S",
    "imageDir": "Performer8s",
    "background": "IMG_20260706_144556987.jpg",

    "tagline": "Convoy from Jupiter",
    "oneSentenceSummary": "A flagship single-DD with pristine technicalities and a warm signature.",
    "footerYear": 2026,

    "rating": {                       // optional
      "dimensions": {
        "Timbre and Tonality": 3.5,
        "Bass and Dynamic": 5,
        "Resolution": 4.5,
        "Soundstage and Imaging": 5
      },
      "showSeal": false
    },

    "graph": "graph.png"             // optional — absent for DAC/DAP
  },
  "sections": [
    { "type": "design-vision",   "images": ["vendor_quote.jpg"] },
    { "type": "packaging",       "images": ["IMG_...301747.jpg", "IMG_...322332.jpg"] },
    { "type": "frequency-response", "images": ["graph.png"] }
  ]
}
```

Two top-level keys: `metadata` (everything global) and `sections` (one
entry per cover slide, in order).

### `metadata` fields

| Field | Required | Notes |
|---|---|---|
| `product` | yes | Full product name shown on the summary slide |
| `imageDir` | yes | Bare name like `"Performer8s"`. The CLI prepends `assets/images/` |
| `background` | yes | Filename of the hero background photo, used on every cover slide and as the summary's gradient background |
| `tagline` | yes (build) | Short tagline shown under the summary title (e.g. "Convoy from Jupiter") |
| `oneSentenceSummary` | yes (build) | A placeholder paragraph in the summary slide; the writer agent fills it in |
| `footerYear` | optional | Copyright year on the summary; defaults to current year |
| `rating` | optional | Object with `dimensions` (4 keys, each 0–5 in 0.5 increments) and `showSeal` (boolean). The `absoluteRating` is **auto-computed** as the mean of the four dimensions rounded to nearest 0.5 — the agent does not supply it. |
| `graph` | optional | Filename of the frequency-response graph. Present → summary shows the FR graph and the FR cover slide is supported. Absent → DAC/DAP builds, no FR anywhere. |

### `sections[]` entries

Each section is `{ "type": "<archetype>", "images": [...] }`.

**The agent does not supply the section's header text.** The builder
generates it from the type:

| Type | Auto-generated header | Image count |
|---|---|---|
| `design-vision` | `DESIGN VISION \| <product>` | 1 |
| `packaging` | `PACKAGING \| <product>` | 1 or 2 |
| `generic` | *(none — slide H1 is just `<product>`)* | 1 |
| `frequency-response` | `FREQUENCY RESPONSE \| <product>` | 1 |
| `frequency-response-comparison` | `FREQUENCY RESPONSE COMPARISON \| <product>` | 2 |

For `generic`, the slide is just a single photo with the product name as
the title — useful for eye-candy or "in the hand" photos that break up
the long wall of text.

Adding a new archetype = one entry in `src/section-types.mjs`. The CLI
rejects unknown types with a list of valid ones.

## How the build works

`slideforge build` runs these steps:

1. **Validate.** Load `slideforge.json`, walk the schema. Refuse to build
   if a required field is missing.
2. **Compose the deck.** `src/markdown.mjs` reads the config + the section
   type registry, generates `slides.md` for the slidev project:
   - One slide per `sections[]` entry, with the type's auto-header and the
     global `background`
   - One summary slide at the end, with the H1, tagline, one-sentence
     summary, the rating row (4.5 → 4 gold + 1 half-gold), the radar chart
     (if `rating.dimensions` present), the FR graph (if `graph` present)
3. **Stage the slidev project.** `src/runner.mjs` writes the generated
   `slides.md` plus the static templates (`style.css`, `vite.config.js`,
   `slide-bottom.vue`, `components/RatingBar.vue`,
   `components/DimensionRadar.vue`) into
   `tools/slideforge/scratch/_build_<imageDir>/`. Also sets up `public/`
   symlinks: `logo.png → ../../../../assets/images/In-ear-gems-2.png`,
   `<imageDir>/ → ../../../../assets/images/<imageDir>/`.
4. **Render.** Runs `slidev export --format png --per-slide` from the
   scratch dir. The `vite.config.js` is the key piece — it injects
   `style.css` into the slidev HTML head so the cover-slide layout classes
   (`.has-dark-overlay`, `.has-gradient-overlay`, `.has-logo`) work
   without each slide having its own `<style>` block (which would create an
   extra empty slide at the start of the deck).
5. **Collect and rename.** Reads the slidev export's `01.png`, `02.png`,
   …, copies + renames to `slide_1.png`, `slide_2.png`, … into
   `<imageDir>/`.

The result is a self-contained PNG set the writer agent can drop into
the blog post: cover slides inline, the last one (`slide_N.png`) as the
hero / summary image in the frontmatter.

## How the design is composed

Three classes do all the visual work, all defined in `templates/style.css`:

| Class | What it does |
|---|---|
| `.has-dark-overlay` | A flat `rgba(0,0,0,0.91)` ::before pseudo-element on top of the cover slide's background image. Used for every cover slide. |
| `.has-gradient-overlay` | A left-to-right gradient overlay (full dark on the left, fading to ~50% dark on the right). Used only on the summary slide. |
| `.has-logo` | Tells `slide-bottom.vue` to render the bottom-right logo on this slide. Cover slides opt in; the summary doesn't. |

The summary's rating widget sits in `<div class="sf-rating-corner">` —
absolute-positioned at top-right by `.slidev-layout > .sf-rating-corner`.
The radar and FR graph sit in `.sf-charts-row` (a flex row) below the
text. The full set of layout rules is in `templates/style.css`; any
styling tweak is one CSS file edit away.

## Reproducing the tool for a new product

1. Take the photos. Numbered files (1.jpg, 2.jpg, ...) under
   `assets/images/<ProductName>/` keep things simple — the config refers
   to each photo by filename.
2. Drop a frequency response graph at
   `assets/images/<ProductName>/<slug>_graph.png`.
3. `slideforge init Performer8s --product "AFUL Performer 8S" --background
   <hero> --graph <graph>` to create the config.
4. `slideforge set tagline …`, `set summary …`, `set rating …` × 4,
   `add section …` × N to fill in the rest. Each subcommand validates its
   input before mutating the file.
5. `slideforge build Performer8s` to render. The result is `slide_1.png`
   … `slide_N.png` in the same directory.
6. Use `slide_N.png` as the hero / header in the blog post frontmatter
   and the earlier `slide_*.png` files inline as cover images.

## For the writer agent (in `.pi/skills/iem-artwork/`)

There is a separate skill that walks the agent through the build flow above.
Load it from the review write phase whenever artwork is needed.

## Notes

- The scratch dir at `tools/slideforge/scratch/_build_<name>/` is wiped
  on every build. Feel free to inspect after a build but don't edit it.
- The tool never touches the source `.jpg`/`.png` files. Re-runs are safe.
- The CLI's resolution for bare names is a small convenience: a
  `Performer8s` arg expands to `assets/images/Performer8s/`. The writer
  agent always uses the bare name; Gen can pass `./foo` or an absolute
  path when working outside the repo root.