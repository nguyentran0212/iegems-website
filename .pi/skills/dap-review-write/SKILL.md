---
name: dap-review-write
description: Phase 3 of the blog workflow. Convert a completed DAP assessment (research file + session file) into a publishable DAP review in Gen's voice. Section-by-section drafting with Gen's approval per section, using the source-thinking preamble template and the multi-section DAP outline (Functionality, Software, Battery, Sonic Performance).
---

# dap-review-write

This is **Phase 3** of the four-phase review workflow described in AGENTS.md. The skill turns a DAP research file and session file into a published DAP review in Gen's voice.

## Activate when

Gen says "write up X", "draft the X DAP review", or supplies a session file and asks for the write phase for a DAP.

## Read first, every review

In order, before drafting anything:

1. `/philosophy`: voice, stance, calibration view, why tonality is preference. (For DAP reviews, the lens is "source", but the calibration view still applies.)
2. `/methodology`: the four rating dimensions (still relevant for the Sonic Performance section), gate anchors, conclusion block.
3. `/vocabulary`: terms the agent must use consistently with Gen. Pay special attention to source-chain vocabulary (pitch black, layering, holographic, dynamic swing) and OS / UI terms (bypass, system-wide SRC, bit-perfect).
4. `/test-tracks`: the canonical track list.
5. The companion research file at `_draft/<product-slug>/YYYY-MM-DD-research.md`.
6. The companion session file at `_draft/<product-slug>/YYYY-MM-DD-session.md`.

If any of these is missing, say so and ask Gen how to proceed.

## Voice anchor

Read this from `_posts/` before drafting:

- Android DAP example: `_posts/2025-03-16-review-HiBy-R6-Pro-Max.md`. Source-thinking framing, multi-section structure (Functionality, Software, Battery, Sonic Performance, Concluding Remarks), detailed walkthrough of HiBy product line as setup. Use as the reference.

This is the only published Android DAP review in the project (Gen has reviewed others but they may have less of the modern structure). The agent reads R6 Pro Max as the closest analog.

## Outcome

The skill produces one file at `_draft/YYYY-MM-DD-review-<Brand>-<Model>.md` (top-level `_draft/`). When Gen approves the draft, the file moves to `_posts/`.

## Outline reference

The DAP outline lives at `outline.md` in this skill's directory. Read it before drafting. DAP outlines are heavier than IEM or DAC outlines: General Information, Functionality, Software, Battery Life, Sonic Performance, Concluding Remarks.

## Workflow

### 1. Preparation

Read all files in "Read first" and the voice anchor. Plan the catchphrase and opening hook. Iterate with Gen until both are accepted.

For DAP reviews, the catchphrase often names the device's role or a specific strength (R6 Pro Max's "The Cheatcode" is an example). Open with a calibration question (R6 Pro Max opens with "what makes a DAP good?") or an anti-expectation framing ("we don't really need a DAP, yet we might want one").

### 2. Static blocks (template-driven)

**Frontmatter.** Same shape as IEM reviews. Use the existing R6 Pro Max post as the format reference (title hyphenated, image in `assets/images/<Folder>/`). Pay attention to casing: R6 Pro Max uses "HiBY" in the title, "R6-Pro-Max" in the image folder.

**Preambles.** Same source-thinking template as DAC reviews (see `dac-review-write/SKILL.md`). Variable fields: provider, manufacturer, retail price, URL.

Present frontmatter and Preambles as one combined block to Gen for approval.

### 3. Section-by-section drafting

Walk the outline (`outline.md`). Sections tend to be longer for DAPs than for IEMs because the OS layer is a whole additional evaluation surface.

For each section:

1. Pull evidence from research and session files.
2. Draft at appropriate length:
   - General Information: 400-700 words. Typically walks the manufacturer's product line up (positioning), then covers audio side (DAC, SoC, amp, power supply), then Android side (SoC, RAM, storage, screen, OS, battery). Reference marketing claims with a one-line translation. Use image inserts for spec sheets if the research file captured them.
   - Functionality: 250-400 words. Each operating mode (Android, Pure Audio, USB DAC, Bluetooth) gets a subheading. Report what Gen tested and what Gen heard or observed.
   - Software: 250-500 words. Android features, audio stack (bypass / bit-perfect), MSEB if relevant, PEQ if relevant, DSP plugins, support settings. Gen's voice is often playful with software, e.g., the "game changer for smaller DAPs" line about DRX10K.
   - Battery Life: 200-400 words. Usually three sub-sections (Runtime, Standby, Charging). Reference AccuBattery or similar app data if the assessment has it. Report real numbers, not vendor claims.
   - Sonic Performance: 400-700 words. Open with a Test setup block. Then the perceived tonality / technical / driveability paragraphs. Reference track callouts from `/test-tracks`. Include IEM pairing notes (high-sensitivity IEMs, low-sensitivity IEMs). Include the comparison section if any.
   - Concluding Remarks: 1-3 paragraphs overall take plus the bullet lists plus the rating block. See "Conclusions block" below.
3. Reference the four test tracks that matter most for the source (Shivers for harshness, Ciaccona for violin and micro-detail, Memory for staging, A Reckoning in Blood for dynamics).
4. Embed product images per section, with captions. The spec-sheet images from the manufacturer page (e.g., the R6-Pro-Max-PO-Specs.png and R6-Pro-Max-LO-Specs.png in R6 Pro Max) are typically embedded in General Information.
5. Present the section draft to Gen for approval. Be ready to iterate.
6. After approval, append to the draft file.

### 4. Conclusions block

Modern DAP reviews (post-2025) include the four-dimension rating block plus the Bias Score. Use the same format as IEM reviews:

```
Concluding Remarks
===

<Gen's overall take, 1-3 paragraphs.>

What I like about this device:

- bullet
- bullet
- bullet
...

What could be improved:

- bullet
- bullet
- bullet
...

What I like about this device: <summary one-liner> 
- ...

**Absolute Sonic Quality Rating: <score>/5 - <descriptor>**
- Timbre and tonality: <score>/5 - <descriptor>
- Bass and dynamic: <score>/5 - <descriptor>
- Resolution: <score>/5 - <descriptor>
- Soundstage and imaging: <score>/5 - <descriptor>

**Bias Score: <score>/5 - <descriptor>**
```

Use the same scoring convention as IEM reviews: 1-5 in 0.5 increments on the dimensions, integer 1-5 on Bias Score. If the assessment file does not have Gen's verbal close or the rating numbers, ask Gen.

### 5. Final assembly

Same as IEM and DAC: end-to-end check for em-dashes, third-person consistency, track callouts across all four dimensions, internal consistency between the body and the rating block. Present the complete draft to Gen for one final pass, then hand off to Phase 4 (`blog-publish`).

## Style rules

Same as IEM, with these DAP-specific additions:

- **The opening question framing.** DAP reviews benefit from a "why does this category even exist" framing before the product walkthrough. R6 Pro Max opens with "what makes a DAP good?". This calibrates the reader's expectation before specs and feature lists.
- **System-wide SRC bypass, bit-perfect mode, MSEB, PEQ, DSP plugins.** These are standard features on modern Android DAPs. Treat them as technical subjects, not marketing fluff. Gen often has opinions on each.
- **Battery life.** Real numbers with the measurement method ("AccuBattery, mixed usage test, 1-hour workload, X volume level"). Avoid citing vendor specs without contesting them against real use.

All other style rules from `iem-review-write` apply: first-person, neutral skepticism, no em-dashes, concise, narrative hooks, tasteful humor, balanced criticism, no marketing language.

## Anti-patterns

Same as IEM, plus:

- Do not write a DAP review as if the source makes sound on its own. Sources change how IEMs sound. Frame everything in terms of the change to the IEM, not the absolute character of the source.
- Do not skip the Software section. Software is half the value of an Android DAP.
- Do not use "good battery" without a numerical anchor. Always cite runtime in hours at a defined workload.

## Worked example

After the first DAP review run lands, look at the produced file. Future DAP reviews should match its structure and length. The R6 Pro Max review at `_posts/2025-03-16-review-HiBy-R6-Pro-Max.md` is the closest analog if no new file has been produced yet.
