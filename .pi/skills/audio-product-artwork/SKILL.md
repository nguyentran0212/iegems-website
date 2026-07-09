---
name: audio-product-artwork
description: Phase 3b of the blog workflow. Generate cover slides and the summary image for any review type (IEM, DAC, DAP) by driving tools/slideforge/. Activated from inside audio-product-write, after the review sections are drafted and before blog-publish.
---

# audio-product-artwork

This is **Phase 3b** of the review workflow. The skill turns source photos and metadata in `assets/images/<product>/` into the artwork the blog post needs: a series of cover slides and a final summary image.

The skill is the same process for all product types. The outline specifies which photos to use for each section and the product type determines which CLI calls to make. The skill reads both and drives the CLI accordingly.

## Activate when

Called from inside `audio-product-write` after Gen approves the prose. Never run this skill proactively.

## Before running the CLI

Read the active outline (`outlines/iem.md`, `outlines/dac.md`, or `outlines/dap.md`) for the review being written. The outline specifies:
- Which photos to use in each section
- Which section gets which archetype (see Archetypes below)

Then look at every file in `assets/images/<product>/` and sort each one into an archetype. Assign each photo to at most one section; do not double-assign.

**Use every photo.** If two photos are nearly identical, use only the better one. Otherwise, every photo goes on a slide.

## Which CLI calls to make

Run the CLI in order. The product type determines which calls are required.

### IEM

```sh
# 1. Init — includes --graph for the FR graph
node tools/slideforge/bin/slideforge.mjs init <imageDir> \
  --product "<Product Full Name>" \
  --background <hero-photo-filename> \
  --graph <fr-graph-filename>

# 2. Text content
node tools/slideforge/bin/slideforge.mjs set tagline <imageDir> --text "<tag line>"
node tools/slideforge/bin/slideforge.mjs set summary <imageDir> --text "<one-sentence summary>"

# 3. Four dimension ratings (feeds the radar on the summary slide)
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Timbre and Tonality"     --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Bass and Dynamic"        --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Resolution"              --score <0-5>
node tools/slideforge/bin/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Soundstage and Imaging" --score <0-5>

# 4. Cover sections — one add section per section in the outline
# IEM archetype types: design-vision, packaging, generic, frequency-response, frequency-response-comparison
# Assign each photo from the sort step to its section and archetype
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type <archetype> --images <file1>[,<file2>]

# 5. Build
node tools/slideforge/bin/slideforge.mjs build <imageDir>
# → N PNGs at assets/images/<imageDir>/slide_{1,2,...,N}.png
```

### DAC / DAP

```sh
# 1. Init — no --graph flag
node tools/slideforge/bin/slideforge.mjs init <imageDir> \
  --product "<Product Full Name>" \
  --background <hero-photo-filename>

# 2. Text content
node tools/slideforge/bin/slideforge.mjs set tagline <imageDir> --text "<tag line>"
node tools/slideforge/bin/slideforge.mjs set summary <imageDir> --text "<one-sentence summary>"

# 3. No ratings — DACs and DAPs do not use the four-dimension radar

# 4. Cover sections — one add section per section in the outline
# DAC/DAP archetype types: design-vision, packaging, generic
# (no frequency-response or frequency-response-comparison)
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type <archetype> --images <file1>[,<file2>]

# 5. Build
node tools/slideforge/bin/slideforge.mjs build <imageDir>
# → N PNGs at assets/images/<imageDir>/slide_{1,2,...,N}.png
```

## Archetypes

Five archetypes exist. Assign each photo to the type that best describes it.

| Archetype | Description | Typical source files |
|---|---|---|
| `design-vision` | Vendor marketing material: brand story, design philosophy, feature callouts, quote cards | `vendor_quote.jpg`, `vendor_spec.jpg` |
| `packaging` | Box, unboxing, accessories laid out | Photos of the box, case, tips, cable, manuals. 1 image = single, 2 images = side-by-side |
| `frequency-response` | A single FR graph (IEM's own FR overlaid on a target) | `graph.png`, any single FR graph |
| `frequency-response-comparison` | A single FR graph showing two overlaid lines, comparing the IEM under review against another IEM or a target | One graph file; two FR curves overlaid |
| `generic` | Everything else — eye candy | IEM on its own, on a desk, in hand, close-ups of faceplate or nozzle, cable, case |

A bare `<imageDir>` like `Performer8s` resolves to `assets/images/Performer8s/`. Pass `./foo` or an absolute path to override.

## Utilities

- `show <imageDir>` — print the current config without mutating it
- `remove section <imageDir> --index <n>` — delete a section by 0-based index (or `--last` for the last section)
- `set <field> <imageDir> --unset` — remove a field (tagline, summary, graph, rating dimension)
- `clean <imageDir>` — remove generated `slide_*.png` from the directory

For the full schema and all options, see `tools/slideforge/README.md`.

## Where the images go in the review

After `build`:

```
slide_1.png   ← first cover section
slide_2.png   ← second cover section
…
slide_N.png   ← the SUMMARY (also the post's hero)
```

- **`slide_N.png` is the hero.** Update the frontmatter `header.image` to point at it.
- **`slide_1` … `slide_{N-1}` are cover slides.** Place them inline in the review body at the start of the sections the outline specifies, with a one-line factual caption.
- **The summary slide is always the last slide.** It is also the hero / header image in the frontmatter.

## Constraints

- The summary slide is always `slide_N.png` (the last one). Always update the frontmatter `header.image` after build.
- Cover slides go inline in the body, one per section, at the section's start.
- Every photo goes on a slide unless two are nearly identical (keep the better one).
- Do not invent section types. The CLI rejects unknown types. If a new archetype is needed, add it to `tools/slideforge/src/section-types.mjs` first.
- Do not run `build` before all required metadata calls have landed (tagline, summary, and for IEMs: all four ratings).
