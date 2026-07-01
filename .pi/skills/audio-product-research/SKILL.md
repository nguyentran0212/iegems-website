---
name: audio-product-research
description: Phase 1 of the blog review workflow. Research an audio product (IEM, DAC, DAP) from manufacturer and vendor pages only, write a working file at _draft/<product-slug>/YYYY-MM-DD-research.md. Do not investigate third-party opinions or community sentiment.
---

# audio-product-research

This skill runs **Phase 1** of the four-phase review workflow described in AGENTS.md. The output is a research file that Phase 2 (assessment session) and Phase 3 (write) draw from.

The skill is intentionally narrow. It does not investigate third-party opinions, look up reviewer verdicts, or chase online sentiment. Measurement graphs and frequency response data are out of scope here; they belong to the Phase 2 listening session.

## Activate when

Gen says: "look up X", "research X", "investigate X", or supplies a URL or product name and asks for research. Also: "phase 1 for X" or "do the research first".

## Output location

`_draft/<product-slug>/YYYY-MM-DD-research.md`

- Create the `_draft/<product-slug>/` folder if it does not exist.
- No front-matter on the file. Jekyll skips files without front-matter, so it stays private.
- Date is the date the research is performed, in `YYYY-MM-DD`.

## Slug convention

Lowercase the product name, replace spaces with hyphens, keep digits and letters joined (no hyphen between a model number and a letter suffix). Examples:

- AFUL Performer 8S → `aful-performer8s`
- Penon Voltage → `penon-voltage`
- Dunu ITO → `dunu-ito`
- HiBy R6 Pro Max → `hiby-r6-pro-max`

## What to research

### For IEMs

- **Driver topology.** Count and types per side (DD, BA, EST, planar, micro planar, passive radiator, bone conductor, etc.).
- **Specifications.** Impedance (with tolerance if given), sensitivity (units: dB/mW or dB/Vrms; note if the vendor does not specify), frequency response range, connector type, available terminations.
- **Manufacturer technology claims.** In-house tech names, patent numbers, crossover designs, acoustic structures. Each claim gets vendor wording preserved, plus a one-line "translation" or skeptical framing note. Do not invent corroboration.
- **Box contents.** Explicit list from vendor pages. Items that are likely but not stated get `[VERIFY]`.
- **Build details.** Shell material, finish, weight (if stated), IP rating (if stated).
- **Cable details.** Conductor material, strand or core count, connectors, available terminations.

### For DACs

DAC chip, amplifier topology, output power at rated impedances, output impedance, gain levels, SNR / THD+N if stated, inputs (USB, optical, coax), outputs (3.5 mm, 4.4 mm, RCA, XLR), Bluetooth codecs if wireless, supported sample rates and bit depths.

### For DAPs

Everything from DACs, plus: OS family and version, screen size and resolution, storage (built-in and expandable), battery life, charging method and speed, Wi-Fi and Bluetooth, supported streaming apps, weight, dimensions.

### For all products

A link to the retailer Gen typically buys from, and the pricing at the time of research with the date the price was scraped.

## Sources

Priority order:

1. **Manufacturer's official product page.** Highest authority for stated specs.
2. **Vendor store page** (e.g., Hifigo, Penon Audio store, Linsoul, Audio Geek Australia store). Same product text often appears here, sometimes with Q&A that adds detail. Use this to corroborate the manufacturer page or fill small gaps.
3. **Measurement databases** only to record the existence of an FR graph, never to reproduce analysis. Acceptable databases: nk-tran.com/iegems-graphtool, sqig.link, oratory1990 archive.

Do not consult, ever:

- Third-party reviews on Head-Fi, Reddit, YouTube, blogs.
- Vendor-page "community review" counts.
- Comments sections.
- Social media.
- Other yappers.

When the manufacturer page and a vendor store page carry identical or near-identical text, cite both and note that they agree, rather than treating one as authoritative.

### Image-only spec sheets (DAP / DAC / sometimes IEM)

Some vendor pages (especially TOTL DAP / DAC) post the spec sheet as designed graphics (numbered PNGs / JPEGs) instead of HTML. Pure scraping leaves text specs blank, which would produce a research file with many `[VERIFY]` items. The agent has two options, in order of preference:

1. **Read the image directly.** Image-input capable tools can take the spec sheet image and extract the spec values. Use this when the missing specs are blocking a review draft. Reserve it for the spec sheet image; pure marketing renders (faceplate renders, lifestyle shots, accessory photos) do not need reading.
2. **Skip and mark `[VERIFY]`.** Default behaviour. Token cost of image reading is non-trivial; the agent decides based on whether the items would meaningfully change the review.

The decision is the agent's, not the user's. When image reading is used, the skill still flags `[VERIFY]` for anything the agent cannot read clearly. When skipped, the open-questions list should call out the image-only spec sheet by name so Gen knows what is missing.

## File template

The research file uses the following sections, in this order:

1. **Header.** Title and date, the trigger URL (the URL Gen supplied), and a one-line note of purpose.
2. **Confirmed specs.** A short table. Drive count, impedance, sensitivity (with units if known), frequency response, connector, termination options, cable composition, shell material, retail price.
3. **Driver topology.** Per-driver description with role if vendor specifies; `[VERIFY]` if not.
4. **Manufacturer technology claims.** Each claim in vendor wording, followed by a one-line "translation" or skeptical framing note. Flag anything that does not correspond to a known physical mechanism.
5. **Box contents.** Two groups: what is explicit (every item the vendor page names), and what is likely but not stated (each item followed by `[VERIFY]`).
6. **Open questions and `[VERIFY]` items.** A single list, not duplicated across the file, of every `[VERIFY]` mark introduced above plus any newly noticed gaps.
7. **Sources consulted.** URLs with brief one-line descriptions and date stamps.

Match the tone and detail level of the worked example at `_draft/aful-performer8s/2026-07-01-research.md`.

## Voice rules

Apply throughout the file:

- No em-dashes anywhere. Use commas or restructure.
- Contractions OK ("doesn't", "isn't").
- Bold for `[VERIFY]` markers and key terms in tables.
- Italic sparingly for filenames or technical labels.
- Honest about what is vendor-side vs third-party-verified. Every factual claim should have a source.

## How to handle `[VERIFY]`

Use `[VERIFY]` inline wherever a fact is uncertain. Also collect every `[VERIFY]` into the "Open questions and `[VERIFY]` items" list near the end of the file so Gen can scan them in one pass. Triggers for `[VERIFY]`:

- Vendor does not specify sensitivity units (dB/mW vs dB/Vrms).
- Driver brand or model attribution is missing.
- Box contents items that are likely but not listed.
- Marketing claims with no plausible physical mechanism to back them up.
- Any spec sourced only from a secondary source.

Gen fills these in or confirms them, usually during the Phase 2 listening session or before publication.

## Anti-patterns

- Do not pull "community sentiment" from Head-Fi, Reddit, YouTube comments, or blogs.
- Do not invent specs or attribute features that are not explicitly stated.
- Do not write the file with front-matter. Jekyll will try to render it as a page otherwise.
- Do not write in third person ("the reviewer thinks"). The research file is a working document with neutral tone.
- Do not run git operations from this skill. Git operations belong to `blog-publish`.

## Worked example

`_draft/aful-performer8s/2026-07-01-research.md` was produced by an earlier run of this skill. Read it before drafting a new file. When in doubt about section depth, ordering, or how to handle a partial-spec situation, match what that file does.
