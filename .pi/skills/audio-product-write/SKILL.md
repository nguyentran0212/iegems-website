---
name: audio-product-write
description: Phase 3 of the blog workflow. Convert a completed assessment (research file + session file) into a publishable review in Gen's voice. Section-by-section drafting with Gen's approval per section, using the appropriate outline and static templates.
---

# audio-product-write

This is **Phase 3** of the four-phase review workflow described in AGENTS.md. The skill turns a research file and session file into a published review in Gen's voice.

The process is the same for all product types (IEM, DAC, DAP). The skill is the invariant process. The outline carries all product-specific content: section structure, per-section guidance, static block templates, artwork placement. The skill knows nothing about any specific product type.

**This skill covers the prose only.** Generating cover slides and the summary image is Phase 3b — handled by a product-specific artwork skill invoked from inside this one as Step 6. It is not optional.

## Activate when

Gen says "write up X", "draft the X review", "now write the X review", or supplies a session file and asks for the write phase.

## Read first, every review

1. `/philosophy`: voice, stance, calibration view, why tonality is preference not technical merit.
2. `/methodology`: the rating dimensions, gate anchors, how ratings appear in the conclusion block, and the Bias Score scale.
3. `/vocabulary`: the canonical terms Gen uses (snappy, oomph, grippy, veil, holographic, toe-tapping, pitch black, layering, etc.).
4. `/test-tracks`: the canonical track list, used for track callouts in the review.
5. The companion research file at `_draft/<product-slug>/YYYY-MM-DD-research.md`.
6. The companion session file at `_draft/<product-slug>/YYYY-MM-DD-session.md`.

If any of these is missing, say so and ask Gen how to proceed.

## Which outline and templates to use

| Product | Outline | Artwork skill | Voice anchors |
|---|---|---|---|
| IEM | `.pi/skills/audio-product-write/outlines/iem.md` | `.pi/skills/audio-product-artwork/` | `_posts/2024-04-08-review-Symphonium-Crimson.md` (positive), `_posts/2025-12-29-review-Juzear-Harrier.md` (critical) |
| DAC | `.pi/skills/audio-product-write/outlines/dac.md` | `.pi/skills/audio-product-artwork/` | `_posts/2023-07-29-review-W4.md` |
| DAP | `.pi/skills/audio-product-write/outlines/dap.md` | `.pi/skills/audio-product-artwork/` | `_posts/2025-03-16-review-HiBy-R6-Pro-Max.md` |

The outline defines everything product-specific: section structure, per-section writing guidance, the forewords / preambles template, the conclusions template, and artwork placement. The skill reads the outline and follows it.

## Rating scale

**IEMs:** Four dimensions rated 1–5 in 0.5 increments (Timbre and Tonality, Bass and Dynamic, Resolution, Soundstage and Imaging). Absolute Sonic Quality Rating is the mean of the four, rounded to one decimal. Bias Score is an integer 1–5 capturing Gen's personal reaction. Descriptors: 5 = outstanding / I love, 4 = great / I like, 3 = good / lukewarm, 2 = not enjoyable / I do not like, 1 = train wreck / dislike.

**DACs and DAPs:** Single Sonic Quality Rating 1–5, anchored by comparison:
- 2/5: Apple USB-C dongle (the baseline most listeners start from)
- 3/5: A generic audiophile USB DAC from 2023
- 4/5: A desktop DAC
- 5/5: Anything that sounds better than a desktop DAC
- Half-integer steps exist as ties happen

Fill ratings from the session file's Final Assessment section or from Gen's verbal close. If neither is present, ask Gen before inventing numbers.

## Workflow

### Step 1: Preparation

1. Read all files in "Read first" and the voice anchors.
2. Read the outline.
3. Plan the catchphrase (2–4 words, the verdict phrase) and the opening hook (1–3 sentences of narrative). Open with something that earns the reader's attention — a story beat, a question, an unexpected framing. Do not open with a spec table or a feature list.
4. Open with one chat message proposing the catchphrase and a first draft of the opening hook. Iterate with Gen until both are accepted.

### Step 2: Static blocks

The outline defines the forewords / preambles template and the conclusions template. Read them from the outline.

**Frontmatter.** Use this template:

```
---
title: "[Manufacturer] [Product Name] - [Catchphrase]"
layout: "single"
excerpts: "[Catchphrase]"
toc: true
header:
    image: "/assets/images/[Folder]/slide_<N>.png"
---
```

Ask Gen if unsure of the folder name. The `header.image` value is updated in Step 7 after artwork is generated.

Present frontmatter and the applicable static block (forewords or preambles) as one combined message to Gen for approval. After approval, append both to the draft file.

### Step 3: Section-by-section drafting

Walk the outline section by section, starting from the first section after the static blocks.

For each section:

1. Pull evidence from the research file and session file.
2. Draft the section in Gen's voice at the length the outline specifies.
3. Reference specific tracks from `/test-tracks` by name, with a one-line cue about what the track exposes. Do not invent tracks.
4. Add artwork as the outline specifies. Embed each image at the start of the section it introduces, with a brief factual caption.
5. Present the section draft to Gen for approval. Be ready to iterate.
6. After approval, append the section to the draft file.

### Step 4: Conclusions block

Use the conclusions template from the outline.

Fill ratings from the session file's Final Assessment section or from Gen's verbal close. If neither is present, ask Gen before inventing numbers.

Present to Gen for approval, then append to the draft file.

### Step 5: Final assembly

Once all sections are approved and written:

1. Read the full file end-to-end.
2. Check for:
   - Em-dashes anywhere (replace with commas or restructure).
   - Third-person where first-person should appear.
   - Internal inconsistencies (scores in the body vs the rating block).
   - Missing track callouts across the dimensions.
3. Present the complete draft to Gen for one final pass.

### Step 6: Generate the artwork (Phase 3b)

After Gen approves the prose but before handing to `blog-publish`, activate `.pi/skills/audio-product-artwork/`. Load that skill and follow its instructions. The artwork skill drives `tools/slideforge/` to render the cover slides and the summary image.

After the artwork skill finishes, update the frontmatter `header.image` to point at the summary slide (`slide_N.png`). Place the cover slides inline as the outline specifies.

DAC and DAP reviews do not have a frequency-response graph. Embed artwork as the outline specifies.

### Step 7: Hand off to Phase 4

After artwork is placed and frontmatter is updated, the file is at `_draft/YYYY-MM-DD-review-<BrandModel>.md` and ready for `blog-publish` to move it to `_posts/` and push.

## Style rules

These are the live style rules Gen enforces. Apply throughout.

- **First-person throughout.** "I find", "I listened", "I observed". Never third-person, never "the reviewer".
- **Neutral skepticism.** Avoid hype adjectives. Use "comes with packaging" not "comes with thoughtful packaging". Factual language, not marketing language.
- **Specific track examples per sonic observation.** Reference track name, what the track exposes, and how the product handles it.
- **Balanced criticism.** Acknowledge strengths and weaknesses without minimising either.
- **Concise.** Avoid repetition. No padding.
- **Narrative hooks when appropriate.** A story-based opening, a question, or an unexpected framing. Do not accuse the manufacturer.
- **Tasteful humor** when the assessment has material for it. Do not overdo.
- **No em-dashes anywhere.** Use commas or restructure sentences. Hard rule.
- **Italicise and bold sparingly.** Do not over-format.

*DAC and DAP specific:*
- **Compare against a baseline source.** On the same IEM and same track, frame the product against the Apple USB-C dongle or equivalent reference.
- **Frame sources as transformers, not sound sources.** Write in terms of the change to the IEM, not the absolute character of the source.

## Anti-patterns

- Do not propose answers based on reading-listening summaries when the session file is empty or thin. Ask Gen.
- Do not paraphrase Gen's voice. Match it from the voice anchors.
- Do not commit a section to the file before Gen's approval on that section.
- Do not move the file to `_posts/`. That is `blog-publish`'s job.
- Do not run git operations from this skill. That is `blog-publish`'s job.
- Do not use em-dashes. Catch this in the final assembly pass.
- Do not use `[VERIFY]` in the published draft. Resolve or remove before approval.
- Do not invent a rating. Ask Gen.
- Do not generate artwork from inside this skill. Activate the matching artwork skill.
- Do not invent slideforge CLI commands. Load the artwork skill for the exact command list.
