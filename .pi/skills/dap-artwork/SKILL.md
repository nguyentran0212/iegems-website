---
name: dap-artwork
description: Phase 3b of the blog workflow for DAP reviews. Generate the cover slides and the end-of-review summary image for a DAP review by driving tools/slideforge/. Activated from inside dap-review-write, after the review sections are drafted and before blog-publish.
---

# dap-artwork

This is **Phase 3b** for DAP (Digital Audio Player) reviews. It is a
thin wrapper around **`tools/slideforge/`**, identical in flow to
`iem-artwork` except that DAPs have no frequency-response graph and no
four-dimension rating radar.

For the full CLI reference, schema, and worked example, read
`.pi/skills/iem-artwork/SKILL.md` first. This file only documents the
differences.

## Differences from `iem-artwork`

1. **No `metadata.graph` field.** DAPs do not have a frequency-response
   graph. Omit the `--graph` flag in `init` and do not call
   `set graph` later.
2. **No `metadata.rating` field.** The four-dimension rating
   (Timbre/Bass/Resolution/Soundstage) is IEM-specific. DAP reviews
   don't have it, so the summary slide has no radar and no star row.
3. **No `frequency-response` cover section.** Use `generic` or
   `packaging` for the cover sections instead.

## The end-to-end flow

```sh
# 1. Create the initial config (no --graph for a DAP)
node tools/slideforge/bin/slideforge.mjs init <imageDir> \
  --product "<DAP Full Name>" \
  --background <hero-photo-filename>

# 2. Add the text content
node tools/slideforge/bin/slideforge.mjs set tagline <imageDir> --text "<tag line>"
node tools/slideforge/bin/slideforge.mjs set summary <imageDir> --text "<one-sentence summary>"

# 3. Add cover sections (no frequency-response, no rating)
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type design-vision --images <vendor_quote.jpg>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type packaging     --images <box1.jpg>,<box2.jpg>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type generic       --images <in_hand.jpg>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type generic       --images <screen1.jpg>

# 4. Build
node tools/slideforge/bin/slideforge.mjs build <imageDir>
# → N PNGs at assets/images/<imageDir>/slide_{1,2,3,...,N}.png
```

`slide_N.png` (the last PNG) is the **summary image** and doubles as
the hero / header image in the post's frontmatter `header.image`.
Place the earlier `slide_*.png` files inline in the review where
their sections start.

## Constraints (all review types)

- The summary image is always the last slide (`slide_N.png`). It is
  also the hero / header of the post (frontmatter `header.image`).
- Cover slides go inline in the body, one per section, typically at
  the start of the section.
- DAPs have no frequency-response graph. There is no tonality section
  in the typical DAP review; if Gen's outline calls for one, it uses
  the title "Tonal Balance" or "Sound Signature" and references the
  summary slide for any chart-style imagery, not a separate FR.