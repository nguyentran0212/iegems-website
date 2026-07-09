---
name: iem-artwork
description: Phase 3b of the blog workflow. Generate the cover slides and the end-of-review summary image for an IEM review by driving tools/slideforge/. Activated from inside iem-review-write, after the review sections are drafted and before blog-publish. Drops slide_*.png into the same assets/images/<product>/ directory the writer agent already references.
---

# iem-artwork

This is **Phase 3b** of the four-phase review workflow. The skill turns
the review's source photos and metadata into the artwork the blog post
needs: a series of cover slides (one per cover section) and a final
summary image that doubles as the post's hero.

The skill is a thin wrapper around **`tools/slideforge/`**. The CLI
there is incremental and validates every step; the agent's job here is
mostly to (1) call the right subcommands in the right order and (2)
place the generated `slide_*.png` files in the review markdown at the
right places.

## Activate when

The writer skill (`iem-review-write`) has drafted all sections. Before
handing the file to `blog-publish`, the agent should activate this
skill to generate the artwork. The iem-review-write skill itself
references this one at the right step — do not try to generate artwork
without first finishing the review sections.

DAC and DAP reviews have their own artwork skills: `dac-artwork` and
`dap-artwork`. They are simpler — no radar chart, no `frequency-response`
type — but the rest of the flow is the same.

## How it works

`tools/slideforge/` is a CLI that reads `assets/images/<product>/slideforge.json`
and writes `slide_1.png` … `slide_N.png` next to the source images.
The agent builds the JSON incrementally via subcommands, the CLI
runs `slidev export` under the hood, and the result is a self-contained
PNG set.

Read **`tools/slideforge/README.md`** for the full schema and CLI
reference. The quick version is below.

## The CLI surface

```sh
# Bare names like "Performer8s" are resolved to
# assets/images/Performer8s/ relative to the cwd. Pass ./foo or an
# absolute path to override.

# 1. Create the initial config (product name + image dir + hero photo + FR graph)
node tools/slideforge/bin/slideforge.mjs init <imageDir> \
  --product "<Product Full Name>" \
  --background <hero-photo-filename> \
  --graph <fr-graph-filename>     # omit for non-IEM reviews

# 2. Add the text content
node tools/slideforge/bin/slideforge.mjs set tagline <imageDir> --text "<tag line>"
node tools/slideforge/bin/slideforge.mjs set summary <imageDir> --text "<one-sentence summary>"

# 3. Add the four rating dimensions (one call per dimension)
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Timbre and Tonality"    --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Bass and Dynamic"        --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Resolution"              --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Soundstage and Imaging" --score <0-5>

# 4. Add cover sections (one per archetype block)
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type design-vision       --images <file1>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type packaging           --images <file1>,<file2>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type frequency-response --images <graph.png>
# (also available: `generic` for one-photo "eye candy" slides,
#  `frequency-response-comparison` for 2-up FR slides)

# 5. Build the deck
node tools/slideforge/bin/slideforge.mjs build <imageDir>
# → N PNGs at assets/images/<imageDir>/slide_{1,2,3,...,N}.png
```

Each subcommand validates before mutating. `add section` checks the
type, image count, and that every file actually exists in `<imageDir>`,
throwing a single-line error on any failure.

### The `sections` archetypes

The agent does **not** supply section headers. The builder generates
them from the type. The available archetypes:

| Type | Auto-generated header | Image count |
|---|---|---|
| `design-vision` | `DESIGN VISION \| <product>` | 1 |
| `packaging` | `PACKAGING \| <product>` | 1 or 2 |
| `generic` | *(none — slide H1 is just `<product>`)* | 1 |
| `frequency-response` | `FREQUENCY RESPONSE \| <product>` | 1 |
| `frequency-response-comparison` | `FREQUENCY RESPONSE COMPARISON \| <product>` | 2 |

Use `generic` for "in the hand" or other eye-candy photos that don't
fit a labelled archetype. The slide H1 is just the product name.

## The config schema (quick reference)

```jsonc
{
  "metadata": {
    "product": "AFUL Performer 8S",
    "imageDir": "Performer8s",
    "background": "IMG_20260706_144556987.jpg",  // hero photo
    "tagline": "Convoy from Jupiter",
    "oneSentenceSummary": "A flagship single-DD with ...",
    "footerYear": 2026,                          // optional
    "rating": {                                   // optional
      "dimensions": {
        "Timbre and Tonality": 3.5,
        "Bass and Dynamic": 5,
        "Resolution": 4.5,
        "Soundstage and Imaging": 5
      }
      // showSeal: false  // optional, default false
    },
    "graph": "graph.png"                         // optional — required for IEM FR
  },
  "sections": [
    { "type": "design-vision",  "images": ["vendor_quote.jpg"] },
    { "type": "packaging",      "images": ["a.jpg", "b.jpg"] },
    { "type": "frequency-response", "images": ["graph.png"] }
    // …
  ]
}
```

Two top-level keys: `metadata` (everything global) and `sections` (one
per cover slide, in order). The CLI rejects unknown section types with
a list of valid ones.

The CLI defaults `footerYear` to the current year and computes
`absoluteRating` (used in the star row) as the mean of the four
dimensions rounded to nearest 0.5 — the agent does **not** supply it.

## Where the generated images go in the review

After `slideforge build`, the following files exist:

```
assets/images/Performer8s/
  (source photos) ...
  slide_1.png   (the first cover section — e.g. "DESIGN VISION")
  slide_2.png   (the second — e.g. "PACKAGING")
  slide_3.png   (the third — e.g. "FREQUENCY RESPONSE")
  slide_4.png   (the SUMMARY — title + tagline + rating + radar + FR + hero)
```

`slide_N.png` (the last one) is the **summary image**. It is **also
the hero / header image** for the blog post. Set the frontmatter's
`header.image` to `/assets/images/Performer8s/slide_N.png` (or the
same path with the `site.assets` prefix that the blog already uses).

The earlier `slide_*.png` files (slides 1 through N-1) are cover slides.
The agent places them in the review body where the corresponding section
is — typically right at the start of the section as a section-opener
image, optionally with a one-line caption. They are *not* the hero.

**For IEM reviews specifically, the frequency-response graph also
appears inside the tonality section of the review.** Two places to
embed it: (1) the `frequency-response` cover slide, if the agent
included one, and (2) the FR panel on the summary slide. Pick one —
typically the dedicated `frequency-response` cover slide gives more
breathing room than the small FR panel on the summary.

## The frontmatter pattern

After the build, the review's frontmatter `header.image` should point
at the summary slide (the last `slide_*.png`). Sketch:

```yaml
---
layout: post
title:  "AFUL Performer 8S — review"
date:   2026-07-08
header:
  image: /assets/images/Performer8s/slide_4.png
categories: [IEM, review]
---

# AFUL Performer 8S

(image: slide_1.png — the design-vision cover)

## In the Box

…
```

Adjust the exact `header.image` path to whatever the blog's existing
posts use (look at a recent published review, e.g.
`_posts/2025-12-29-review-Juzear-Harrier.md`).

## Worked example (Performer8s end-to-end)

```sh
node tools/slideforge/bin/slideforge.mjs init Performer8s \
  --product "AFUL Performer 8S" \
  --background IMG_20260706_144556987.jpg \
  --graph graph.png

node tools/slideforge/bin/slideforge.mjs set tagline Performer8s --text "Convoy from Jupiter"
node tools/slideforge/bin/slideforge.mjs set summary Performer8s --text "A flagship single-DD with pristine technicalities and a warm signature."

node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Timbre and Tonality" --score 3.5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Bass and Dynamic"   --score 5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Resolution"         --score 4.5
node tools/slideforge/bin/slideforge.mjs set rating Performer8s --dimension "Soundstage and Imaging" --score 5

node tools/slideforge/bin/slideforge.mjs add section Performer8s --type design-vision   --images vendor_quote.jpg
node tools/slideforge/bin/slideforge.mjs add section Performer8s --type packaging       --images IMG_20260706_144301747.jpg,IMG_20260706_144322332.jpg
node tools/slideforge/bin/slideforge.mjs add section Performer8s --type frequency-response --images graph.png

node tools/slideforge/bin/slideforge.mjs build Performer8s
```

Result:

```
assets/images/Performer8s/
  slide_1.png   — DESIGN VISION | AFUL Performer 8S
  slide_2.png   — PACKAGING | AFUL Performer 8S
  slide_3.png   — FREQUENCY RESPONSE | AFUL Performer 8S
  slide_4.png   — SUMMARY (the hero)
```

## Anti-patterns

- Do not invent section types. The CLI rejects unknown types. If a
  product needs a new archetype, add it to
  `tools/slideforge/src/section-types.mjs` first.
- Do not name section headers in the config. The builder generates them
  from the type. The agent only supplies the type and the images.
- Do not supply `absoluteRating`. The CLI computes it from the
  dimensions; supplying it manually risks inconsistency with the radar.
- Do not run `slideforge build` before all four `set rating` calls have
  landed. The CLI is tolerant of missing dimensions but the resulting
  radar will be wrong.
- Do not commit `slide_*.png` to `_posts/`. They live in
  `assets/images/<product>/`, the same directory the source photos are
  in. The blog references them by path.
- Do not run `slideforge build` from inside the `_draft/<slug>/`
  working folder. Always run it from the repo root so the bare-name
  resolution (`Performer8s` → `assets/images/Performer8s/`) works.

## Notes

- `node tools/slideforge/bin/slideforge.mjs serve <imageDir>` runs the
  slidev dev server against the generated slides. Useful for previewing
  the layout in a browser before building. No PNGs are written.
- `node tools/slideforge/bin/slideforge.mjs clean <imageDir>` removes
  generated `slide_*.png` from the image directory. Use before a
  full re-render if the section list has changed.
- The CLI's resolution for bare names is a small convenience: a
  `Performer8s` arg expands to `assets/images/Performer8s/`. The
  agent always uses the bare name; Gen can pass `./foo` or an absolute
  path when working outside the repo root.