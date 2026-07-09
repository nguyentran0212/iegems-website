---
name: iem-artwork
description: Phase 3b of the blog workflow. Generate the cover slides and the end-of-review summary image for an IEM review by driving tools/slideforge/. Activated from inside iem-review-write, after the review sections are drafted and before blog-publish. Drops slide_*.png into the same assets/images/<product>/ directory the writer agent already references.
---

# iem-artwork

This is **Phase 3b** of the review workflow. The skill turns the source
photos and metadata in `assets/images/<product>/` into the artwork the
blog post needs: a series of cover slides (one per cover section) and a
final summary image that doubles as the post's hero.

The skill is a thin wrapper around **`tools/slideforge/`**. The CLI
there is incremental and validates every step. The agent's job is to
(1) pick the right archetype for each photo, (2) call the right
subcommands in the right order, and (3) place the generated
`slide_*.png` files in the review markdown at the right places.


## Image selection — use every photo

Before running any CLI commands, look at every file in
`assets/images/<product>/`. Sort each photo into one of these four archetypes:


| Type | What goes here | Examples of source files |
|---|---|---|
| `design-vision` | Vendor marketing material: quote cards, design philosophy, "recommended audio", feature callouts, brand storytelling | `vendor_quote.jpg`, `vendor_spec.jpg`, anything that's a screenshot of a vendor's promo page with a quote or design story |
| `packaging` | Box, unboxing, accessories laid out, what's-in-the-box content | Photos showing the box, the case, the eartips, the cable, manuals. 1 image = single, 2 images = side-by-side |
| `frequency-response` | A single FR graph (the IEM's own FR overlaid on a target like Harman). Use this type even if the graph also shows a target line. | `graph.png`, any single `graph*.png` that shows the IEM on its own |
| `frequency-response-comparison` | Two FR graphs side-by-side, comparing the IEM against another IEM or against a target | `graph (1).png` + `graph (2).png` paired, or any 2-up comparison FRs |
| `generic` | **Everything else — eye candy.** Use this for any photo that doesn't fit the above. IEM on its own, on a desk, in hand, with a music player, side-by-side with another IEM, close-ups of the faceplate, the nozzle, the cable, the case, etc. | Numbered photos `1.jpg` … `15.jpg` are almost always generic. `vendor_content.jpg` (the contents flat-lay) is also generic, not packaging — see below |


**Use every photo.** Once a photo is sorted, the agent builds one
section per photo (or 1-2 photos per `packaging` section, 2 photos per
`frequency-response-comparison` section). A typical 15-photo product
directory produces 13-15 cover slides + 1 summary = 14-16 PNGs.

## The build flow

Run the CLI in order. Each subcommand validates its input before
mutating the config. The agent drives the build by calling
`tools/slideforge/bin/slideforge.mjs` from the repo root.

```sh
# 1. Init: create the config, point at the hero photo (the "most cachy"
#    one — usually a faceplate close-up) and the primary FR graph.
node tools/slideforge/bin/slideforge.mjs init <imageDir> \
  --product "<Product Full Name>" \
  --background <hero-photo-filename> \
  --graph <fr-graph-filename>

# 2. Text content
node tools/slideforge/bin/slideforge.mjs set tagline <imageDir> --text "<tag line>"
node tools/slideforge/bin/slideforge.mjs set summary <imageDir> --text "<one-sentence summary>"

# 3. Rating (one call per dimension, all four required for the radar)
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Timbre and Tonality"     --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Bass and Dynamic"        --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Resolution"              --score <0-5>
node tools/slideforge/bin/slideforge.mjs set rating <imageDir> --dimension "Soundstage and Imaging" --score <0-5>

# 4. Sections (one call per cover slide, in the order they should appear)
# Call this as many times as needed until you  have added all the photos you planned to use
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type design-vision  --images <file1>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type packaging      --images <file1>[,<file2>]
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type generic        --images <file>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type frequency-response          --images <fr-graph.png>
node tools/slideforge/bin/slideforge.mjs add section <imageDir> --type frequency-response-comparison --images <fr1.png>,<fr2.png>

# 5. Build
node tools/slideforge/bin/slideforge.mjs build <imageDir>
# → N PNGs at assets/images/<imageDir>/slide_{1,2,...,N}.png
```

A bare `<imageDir>` like `Performer8s` resolves to
`assets/images/Performer8s/`. Pass `./foo` or an absolute path to
override. The full schema and option list are in
`tools/slideforge/README.md`.

To remove a section you added in error: `remove section <imageDir>
--index <n>` (or `--last`). To remove a metadata field: `set <field>
<imageDir> --unset`. To see the current config: `show <imageDir>`.

## Section ordering

The agent chooses the order. A common pattern:

1. `design-vision` — opens the review with the brand's story
2. `packaging` — what's in the box, before the spec table
3. `generic` × N — eye candy interleaved with the rest of the review
4. `frequency-response` (and `frequency-response-comparison` if there are 2-up graphs) — measurement-driven
5. `generic` × N — closing eye candy

But the order is the agent's call. Use `slideforge show` to preview
the current section list with implicit 0-based indices.

## Where the generated images go in the review

After `build` finishes, the following files exist in
`assets/images/<product>/`:

```
slide_1.png   ← first cover section (e.g. "DESIGN VISION")
slide_2.png   ← second cover section (e.g. "PACKAGING")
…
slide_N.png   ← the SUMMARY (also the post's hero)
```

- **`slide_N.png` is the hero.** Set the frontmatter's `header.image`
  to it. See the existing published reviews for the exact path prefix
  (e.g. `_posts/2025-12-29-review-Juzear-Harrier.md`).
- **`slide_1` … `slide_{N-1}` are cover slides.** Place them inline
  in the review body, one per cover section, at the start of the
  section they introduce, with a one-line caption. They are not
  the hero.
- **The frequency-response graph must appear in the Sound Signature
  & Tonal Balance section.** Either the dedicated `frequency-response`
  cover slide (if one was generated) or the FR panel on the summary
  slide is the source. Reference the chosen image with a one-line
  caption in the tonality section, and tie the prose back to the
  measurement observations from the session file.

## Anti-patterns

- Do not skip photos. **Every photo in the directory goes on a slide, unless two photos are nearly identical, then use only the better one.**
  If a product directory has 15 photos, the build produces 14-16 PNGs
  (one fewer if the agent packs 2 into a `packaging` or
  `frequency-response-comparison` section, never more than that).
- Do not invent section types. The CLI rejects unknown types. If a
  product needs a new archetype, add it to
  `tools/slideforge/src/section-types.mjs` first.
- Do not run `slideforge build` before all four `set rating` calls
  have landed. The resulting radar will be wrong.
