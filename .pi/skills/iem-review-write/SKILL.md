---
name: iem-review-write
description: Phase 3 of the blog workflow. Convert a completed IEM assessment (research file + session file) into a publishable review in Gen's voice. Section-by-section drafting with Gen's approval per section, using static frontmatter and forewords templates and the post-2024 IEM outline.
---

# iem-review-write

This is **Phase 3** of the four-phase review workflow described in AGENTS.md. The skill turns the research file and the session file into a published IEM review in Gen's voice, using the post-2024 outline convention.

## Activate when

Gen says "write up X", "draft the X review", "now write the X review", or supplies a session file and asks for the write phase.

## Read first, every review

In order, before drafting anything:

1. `/philosophy`: voice, stance, calibration view, why tonality is preference not technical merit.
2. `/methodology`: the four rating dimensions, gate IEMs, how ratings appear in the conclusion block, the Bias Score scale.
3. `/vocabulary`: terms the agent must use consistently with Gen (snappy, oomph, grippy, veil, holographic, toe-tapping, pitch black, etc.).
4. `/test-tracks`: the canonical track list, used for track callouts in the review.
5. The companion research file at `_draft/<product-slug>/YYYY-MM-DD-research.md`.
6. The companion session file at `_draft/<product-slug>/YYYY-MM-DD-session.md`.

If any of these is missing, say so and ask Gen how to proceed.

## Voice anchors

Read **both** of these from `_posts/` before drafting:

- Positive IEM example: `_posts/2024-04-08-review-Symphonium-Crimson.md`. Warm, "engineering beauty" voice. Use as the reference when the assessment comes out positive.
- Disappointing IEM example: `_posts/2025-12-29-review-Juzear-Harrier.md`. Critical voice. Use as the reference when the assessment comes out negative.

Read whichever matches the assessment tone, read both if the verdict is mixed. The agent calibrates voice choice by reading the right anchor first.

## Outcome

The skill produces one file at `_draft/YYYY-MM-DD-review-<BrandModel>.md` (note: top-level `_draft/`, not the per-product folder). When Gen approves the draft, the file moves to `_posts/`.

The image-folder convention is `assets/images/<Brand>-<Model>/<n>.jpg` (matches existing reviews). The header image is typically the summary photo (e.g. `Crimson_summary.jpg`, `Penon_Voltage_summary.png`).

## Outline reference

The post-2024 IEM outline lives at `outline.md` in this skill's directory. Read it before drafting. Sections, in order: Forewords → In the Box → General Information → Experience (Physical Handling, Sound Signature & Tonal Balance) → Technical Performance (Resolution, Soundstage & Imaging, Bass Performance) → Selected Comparisons (optional) → Conclusions.

## Workflow

Per Gen's prior protocol. The skill carries the static bits (templates, voice rules); the session file carries the data.

### 1. Preparation

1. Read all files in "Read first" and the two voice anchors.
2. Plan the catchphrase (a short verdict phrase, typically 2-4 words) and the opening hook (1-3 sentences of narrative opening).
3. Open with one chat message that proposes the catchphrase and a first draft of the opening hook. Iterate with Gen until both are accepted.

### 2. Static blocks (template-driven)

**Frontmatter.** Use this template, replacing bracketed tokens with assessment data:

```
---
title: "[Manufacturer] [Product Name] - [Catchphrase]"
layout: "single"
excerpts: "[Catchphrase]"
toc: true
header:
    image: "/assets/images/[Manufacturer-Folder]/[ProductImage-summary].jpg"
---
```

The image filename should match the existing `assets/images/<Folder>/<n>_<descriptor>.jpg` pattern. If unsure of the folder name, ask Gen.

**Forewords.** Use the standard template, replacing bracketed tokens:

```
Forewords
===

- What I look for in an IEM is **immersion.** I want to feel the orchestra around my head, track individual instruments, and hear all of their textures and details. I'm not picky about tonality, as long as it does not make the orchestra, violin, cellos, and pianos sound wrong.
- I rate IEMs within with a consistent scale from **1 (Poor) to 3 (Good) to 5 (Outstanding)**. An overall ranking of 3/5 or above is considered positive.
- Ranking list and measurement database are on [my IEM review blog](https://iegems.nk-tran.com/).
- The terminology for subjective impressions in this review is based on the Audio Wheel for reproduced sound defined in the technical report [ITU-R BS.2399-0](https://www.itu.int/pub/R-REP-BS.2399)
- **This review is based on a review sample from [Provider] (Thank you!).** I have no affiliation with or financial interest in [Manufacturer]. 
- The unit retails for **[Price]**. Unaffiliated link: [URL]
```

For sample source, use "review sample from [Provider]" for tour/loan units, or rephrase to "I purchased this unit on my own" when the unit is self-bought. For retail price, use the figure from the assessment file (or `[VERIFY]` if not confirmed).

Present both frontmatter and forewords as one combined block to Gen for approval. After approval, write both to the draft file in one append.

### 3. Section-by-section drafting

Walk the outline (`outline.md`) section by section, starting from "In the Box." For each section:

1. Pull evidence from the research file and session file.
2. Draft the section in Gen's voice at the appropriate length:
   - In the Box: ~150 words, one or two paragraphs, itemised accessories.
   - General Information: ~250-400 words, paragraphs for design + spec table.
   - Physical Handling: ~250 words.
   - Sound Signature & Tonal Balance: ~400 words, often the longest in the review.
   - Resolution: ~200 words.
   - Soundstage & Imaging: ~150 words.
   - Bass Performance: ~200 words.
   - Selected Comparisons (if used): 1-3 IEMs, ~200 words each.
   - Conclusions: ~150 words plus the two bullet lists and the rating block.
3. Embed track callouts. Reference specific tracks from `/test-tracks` by name, with a one-line cue about what the track exposes. Cover at least one track per dimension. Do not invent tracks.
4. Reference any FR graph if `assets/images/<Folder>/<name>_Graph_Harman.png` exists.
5. Add at least one product image per section where the research file flags relevant photos, with a brief caption.
6. Present the section draft to Gen for approval. Be ready to iterate.
7. After approval, append the section to the draft file.

### 4. Conclusions block

The Conclusions block follows a fixed structure:

```
Conclusions
===

<Gen's overall take in 1-3 paragraphs.>

**What I like about this IEM:**

- bullet
- bullet
- bullet
...

**What could be improved:**

- bullet
- bullet
- bullet
...

**Absolute Sonic Quality Rating: <score>/5 - <descriptor>**

- Timbre and tonality: <score>/5 - <descriptor>
- Bass and dynamic: <score>/5 - <descriptor>
- Resolution: <score>/5 - <descriptor>
- Soundstage and imaging: <score>/5 - <descriptor>

**Bias Score: <score>/5 - <descriptor>**
```

The four dimension scores and the Absolute are typically whole or half-integers (1, 1.5, 2, ..., 5). Bias Score is an integer 1-5. Descriptors map to score: 5 = outstanding / I love this IEM, 4 = great / I like this IEM, 3 = good / I am lukewarm, 2 = not enjoyable / I do not like, 1 = train wreck / I dislike. The Methodology page has the canonical anchor scales.

Fill these from the session file's Final Assessment section or from Gen's verbal close. If neither is present, ask Gen before inventing numbers.

### 5. Final assembly

Once all sections are approved and written:

1. Read the full file end-to-end. Check for:
   - Em-dashes anywhere (replace with commas or restructure).
   - Third-person where first-person should appear.
   - Internal inconsistencies (scores in body vs the rating block).
   - Missing track callouts per dimension.
2. Present the complete draft to Gen for one final pass.
3. After Gen's approval, the file is ready for Phase 4 (`blog-publish`) to push it to `_posts/` and the remote.

## Style rules

These are the live style rules Gen enforces. Apply throughout. They come from Gen's prior written instruction, refined by observations of recent reviews.

- **First-person throughout.** "I find", "I listened", "I observed". Never third-person, never "the reviewer".
- **Neutral skepticism.** Avoid hype adjectives. Use "comes with packaging" not "comes with thoughtful packaging". Use "the cable feels gummy" not "the cable feels gummy but premium". Use factual language, not marketing language.
- **Specific track examples per sonic observation.** Reference track name, what the track exposes, and how the IEM handles it.
- **Balanced criticism.** Acknowledge strengths and weaknesses without minimising either.
- **Concise.** Avoid repetition. No padding.
- **Narrative hooks when appropriate.** A story-based opening ("I never set out to fall for..."), a question, or an unexpected framing. Do not accuse the manufacturer. Do not imply AI-generated output.
- **Tasteful humor** when the assessment has material for it. Do not overdo.
- **No em-dashes anywhere.** Use commas or restructure sentences. This is a hard rule.
- **Italicise and bold sparingly** for emphasis on key takeaways. Do not over-format.

## Anti-patterns

- Do not propose answers based on reading-listening summaries when the session file is empty or thin. Ask Gen.
- Do not paraphrase Gen's voice in the captured prose. Match his voice from the anchors.
- Do not commit a section to the file before Gen's approval on that section.
- Do not move the file to `_posts/` from this skill. That is `blog-publish`'s job.
- Do not run git operations from this skill. That is `blog-publish`'s job.
- Do not use em-dashes. Comma or restructure. Catch this in the final-assembly pass.
- Do not use `[VERIFY]` in the published draft. Resolve or remove those before approval.

## Worked example

After the first review run with this skill lands, look at the produced file. Future reviews should match its structure and length. The Hidizs MK12 review at `_posts/2025-06-07-review-Hidizs-MK12.md` is also a working structural reference for the post-2024 outline convention.
