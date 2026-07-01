---
name: dac-review-write
description: Phase 3 of the blog workflow. Convert a completed DAC assessment (research file + session file) into a publishable DAC review in Gen's voice. Section-by-section drafting with Gen's approval per section, using the source-thinking forewords template and a DAC-specific outline.
---

# dac-review-write

This is **Phase 3** of the four-phase review workflow described in AGENTS.md. The skill turns a DAC research file and session file into a published DAC review in Gen's voice.

## Activate when

Gen says "write up X", "draft the X DAC review", or supplies a session file and asks for the write phase for a DAC.

## Read first, every review

In order, before drafting anything:

1. `/philosophy`: voice, stance, why tonality is preference not technical merit. (For DAC reviews, the lens is "source" rather than "IEM", but the calibration view still applies.)
2. `/methodology`: the four rating dimensions (re-purposed: tonality, resolution/bass/dynamics, soundstage are still useful framings for source reviews), gate anchors, how ratings appear in the conclusion.
3. `/vocabulary`: terms the agent must use consistently with Gen (pitch black, layering, holographic, snappy, oomph, etc.). Pay special attention to source-chain vocabulary (output impedance, current delivery, driveability).
4. `/test-tracks`: the canonical track list. DAC reviews reuse the same test tracks as IEM reviews.
5. The companion research file at `_draft/<product-slug>/YYYY-MM-DD-research.md`.
6. The companion session file at `_draft/<product-slug>/YYYY-MM-DD-session.md`.

If any of these is missing, say so and ask Gen how to proceed.

## Voice anchor

Read this from `_posts/` before drafting:

- USB DAC example: `_posts/2023-07-29-review-W4.md`. Super-dongle voice. Source-thinking framing. Compare-against-Apple-dongle tone. Cautionary prose on idle battery drain. Use as the reference when the assessment has matching tone.

This is the only published DAC review in the project. The agent reads it once before drafting, treats it as the closest analog.

## Outcome

The skill produces one file at `_draft/YYYY-MM-DD-review-<Brand>-<Model>.md` (top-level `_draft/`). When Gen approves the draft, the file moves to `_posts/`.

The image-folder convention is `assets/images/<BrandModel or Abbreviation>/<n>_<descriptor>.jpg` (matches existing reviews). Note W4 uses the abbreviation `W4` as the folder name.

## Outline reference

The DAC outline lives at `outline.md` in this skill's directory. Read it before drafting.

## Workflow

### 1. Preparation

Same as IEM: read all files in "Read first" plus the voice anchor. Plan the catchphrase and opening hook. Iterate with Gen until both are accepted.

For DAC reviews, the catchphrase often contrasts the source with what it replaces (e.g. "Super dongle. Still dongle." for W4) or names a specific sonic quality. Open with a question, a calibration framing, or a setup anecdote (W4's "what makes a DAP good" opener was a stand-in for "what makes a source good").

### 2. Static blocks (template-driven)

**Frontmatter.** Same shape as IEM reviews. Use the existing review as the format reference.

**Preambles** (DAC template, replaces the IEM "Forewords" block):

```
Preambles:
===
- In this review, I use the term "source" to denote a DAC+amp combo for brevity and convenience.
- Sources do not make sounds. Therefore, when I say sources "sound" a certain way, I talk about the change they make to my IEMs and earphones.
- I want my music to be crisp, clear, well-separated and form a 3D soundstage around my head. Sources that intensify those characteristics of my IEMs are considered "better".
- **This review is based on a review sample from [Provider] (Thank you!).** I have no affiliation with or financial interest in [Manufacturer]. The unit retails for [Price] at [URL].
```

Variable fields: provider, manufacturer, retail price, URL.

Present frontmatter and Preambles as one combined block to Gen for approval.

### 3. Section-by-section drafting

Walk the outline (`outline.md`) section by section. For each section:

1. Pull evidence from research and session files.
2. Draft at appropriate length:
   - General Information / Specs: spec table plus 1-2 paragraphs on hardware architecture. DAC reviews sometimes include a brief walkthrough of the manufacturer's product line up (see R6 Pro Max and R8 II treats) if the unit is positioned in a family.
   - Non-sound Aspects: build, design, controls, software (if any), compatibility, battery drain for portable DACs.
   - Sound Performance: 200-400 words across Tonality and Technical Performance subsections. For DAC, the "Test setup:" block at the top of Sound Performance is standard (sources used, IEMs tested against, ear tips, volume level). Reference test tracks from `/test-tracks`.
   - Driveability testing: typically structured as a sequence of IEMs tested (easy-to-drive, high-sensitivity, low-impedance low-sensitivity, high-impedance), each ~150 words.
   - Comparisons: 1-3 sources, ~150-200 words each. Common baseline is the Apple dongle, then a step up to a higher-end DAP or DAC.
   - Conclusion: 1-2 paragraphs overall take plus the bullet lists (Pros/Cons format is older; "What I like / What could be improved" is newer per MK12).
3. Reference the four test tracks that matter most for the source: Shivers for harshness, Ciaccona for violin/micro-detail, Memory for staging, A Reckoning in Blood for dynamics. Pick the relevant ones.
4. Add product images per section, with captions.
5. Present the section draft to Gen for approval. Be ready to iterate.
6. After approval, append to the draft file.

### 4. Conclusions block

DAC reviews do not always use the same four-dimension rating block as IEM reviews. Older reviews (W4) use Pros/Cons + an absolute rating. Newer reviews sometimes use the four-dimension block. Default to whichever the assessment file suggests or which matches Gen's stated preference. If unclear, ask.

When the four-dimension block is used, fill from the session file's Final Assessment or from Gen's verbal close. Same integer-or-half-integer convention as IEM reviews.

### 5. Final assembly

Same as IEM: read end-to-end, check for em-dashes (catch this), check third-person consistency, check track callouts across all four dimensions, present to Gen for one final pass, then hand off to Phase 4 (`blog-publish`).

## Style rules

Same as IEM, with one DAC-specific addition: **compare against a baseline source** (Apple dongle, R3II, or whichever Gen uses as reference) on the same IEM and same track. DAC reviews live or die on the comparison framing. Without it, the review has no anchor for "is this sound good?"

All other style rules from `iem-review-write` apply: first-person, neutral skepticism, no em-dashes, concise, narrative hooks, tasteful humor, balanced criticism, no marketing language.

## Anti-patterns

Same anti-patterns as IEM, plus:

- Do not write a DAC review without an explicit baseline-source comparison. The reader needs to know how the unit stacks against the Apple dongle or equivalent.
- Do not use "add warmth" or "add bass" as a positive descriptor without specifying what gets reduced in exchange. Sources are not additive in Gen's vocabulary.

## Worked example

After the first DAC review run lands, look at the produced file. Future DAC reviews should match its structure and length. The existing W4 review at `_posts/2023-07-29-review-W4.md` is the closest analog if no new file has been produced yet.
