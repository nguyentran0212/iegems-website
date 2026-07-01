---
name: audio-product-session
description: Phase 2 of the blog workflow. Run an interview-style listening session for an audio product (IEM, DAC, or DAP). Walks test tracks dim-by-dim, runs assessment Q&A from question files (with inference from listening impressions before asking), gets Gen's final summary and recommendation, captures everything into a session file the write phase builds on.
---

# audio-product-session

This is **Phase 2** of the four-phase review workflow described in AGENTS.md. The session gathers subjective evidence the write phase (Phase 3) lifts from: per-track listening impressions, answers to assessment questions, and Gen's final summary plus recommendation.

## Activate when

Gen says "let's do the listen session for X", "interview me on X", "session next", or supplies a research file and asks for a session.

## Read first, every session

Before asking Gen anything, read these four pages in this order. They are the basis for speaking the same vocabulary and rating the same way Gen does:

1. `/philosophy`: voice, stance, why reviews are written the way they are, the calibration view, what tonality-is-preference means. The lens for everything below.
2. `/methodology`: the four rating dimensions (Timbre and Tonality, Bass and Dynamic, Resolution, Soundstage and Imaging), the gate IEM anchors (Aria, Blessing 2, Andromeda 2020, Cantor), the rubrics, how ratings appear at the end of a review.
3. `/vocabulary`: the canonical terms the agent and Gen both use, including Gen's particular terms (snappy, oomph, grippy, veil, holographic, toe-tapping, etc.) and the Sound Wheel lexicon.
4. `/test-tracks`: the canonical track list and what each track tests. Phase 2 walks this list. The page is the source of truth; the agent does not maintain a parallel list.

If the agent cannot load any of these pages, say so and stop; do not improvise.

## Question files

Three reference files in this skill:

- `questions/iem.md` for IEMs.
- `questions/dac.md` for DACs.
- `questions/dap.md` for DAPs.

Read the one matching the product under review before Phase 3.

## Output

`_draft/<product-slug>/YYYY-MM-DD-session.md`

The research file `YYYY-MM-DD-research.md` should already exist in the same folder; if it does not, ask Gen whether to proceed or to run research first.

## Phase 1: Setup confirmation

One short opening message. Confirm:

- Product under test (full name and SKU if applicable).
- Rig: for IEMs, sources + cables + ear tips + listening volume. For DAC / DAP, IEMs or headphones used to drive it + the baseline source for comparison.
- Music library or playlist used.
- Burn-in status of the unit (for IEMs) or firmware version (for DAPs / DACs).
- Any known caveats (e.g., unit is half-broken, ear tips are not the final pair).

Capture this into a "Setup notes" block at the top of the session file for context only. Do not duplicate general product information, which already lives in the research file.

## Phase 2: Listening Test

Pull cues from `/test-tracks` (a public page in this repo). The page is canonical; the agent does not maintain a parallel track list. Walk tracks in the dimension grouping order the page specifies.

**Per track:**

1. Tell Gen the next track. Include track name, artist, and the page's stated cue for that track.
2. Wait for Gen's response.
3. Capture verbatim into one paragraph under a track header in the file. Include the track metadata (song, artist, link) at the start of the paragraph.
4. If Gen's response is short, probe once with a follow-up like "Where in the track is that most obvious?", "Is that the upper-midrange or the treble?", "How does it compare to Aria for that cue?". Do not probe twice.
5. If Gen has nothing to say, capture "no comment" and move on. Do not skip tracks.

## Phase 3: Assessment Q&A

Walk the question file section by section. The questions are pre-organised by these section headings: Non-sound aspects, Timbre and Tonality, Bass and Dynamic, Resolution, Spatial.

**Per question:**

1. **Infer first.** Try to answer the question from Gen's listening impressions captured in Phase 2 plus any answers already given in this session. If you can construct a defensible answer, show it to Gen as a draft and ask if it matches, with an offer to refine.
2. **Ask only if you cannot infer.** Pose the question once, neutrally. Probe once if the answer is vague. Move on regardless of answer quality once Gen has said something.
3. **Capture verbatim under the appropriate section heading.** Do not write the question text in the file. Only the answer.
4. Continue to the next question.

**Section structure in the file.** Mirror the question file's section order. Within each section, the agent captures answers as bullet points or short paragraphs. One answer per question, in the question's order.

**Special handling for rating-scale questions** (e.g., "On the scale from Aria to Blessing 2 to Andromeda 2020 to Cantor, how resolving is this IEM?"). These come from the IEM question file's Resolution and Spatial sections. Use the gate-IEM anchors documented in `/methodology`. Treat the gate scale as canonical. If Gen struggles to place the unit on the scale, walk through the gates one at a time: "Compared to Aria, this is... higher, lower, or about the same?" Then the next gate, etc., until placement emerges. Capture the placement verbatim.

**Special handling for FPS-gaming questions** (IEM Spatial and DAC/DAP Spatial). Skip if Gen does not currently game. Capture "not tested, does not game" and move on.

## Phase 4: Final Assessment

This is the load-bearing phase for the write phase. Run it carefully.

1. **Agent drafts a summary** based on all listening impressions and assessment Q&A captured so far. Show the draft to Gen.
2. **Iterate.** Gen edits, corrects, or extends. The agent captures the iteration in the chat but does not yet write to the file.
3. **Final version.** When Gen says the summary is right, capture it into the "## Final Assessment > ## Summary" section.
4. **Overall thought.** Ask Gen for one to three sentences capturing his final overall impression of the product. Capture verbatim into "## Final Assessment > ## Overall thought."
5. **Recommendation.** Ask Gen whether and for whom he recommends the product. Capture verbatim into "## Final Assessment > ## Recommendation."
6. Notify Gen that the assessment process is now complete.

## Output file structure

Note: setup details do not appear in this file. They live in the companion research file (`YYYY-MM-DD-research.md`) which already has general product information. The session file is purely listening impressions and assessment captures.

```
# <Product Name> assessment

## Listening Test

### <Track name> by <Artist>

<YouTube link>

<Gen's paragraph of impressions, verbatim>

(... repeated for each track ...)

## Assessment

### Non-sound aspects

- <answer to non-sound question 1, verbatim>
- <answer to non-sound question 2, verbatim>
- ...

### Timbre and Tonality

- <verbatim answer>
...

### Bass and Dynamic

- ...
...

### Resolution

- ...
...

### Spatial

- ...
...

## Final Assessment

### Summary

<Gen's adjusted summary, after iterating with the agent's draft>

### Overall thought

<Gen's 1-3 sentence conclusion, verbatim>

### Recommendation

<Gen's recommendation, verbatim>
```

## Voice rules

- No em-dashes anywhere in the file. Use commas or restructure.
- Capture Gen's voice, not the agent's. Verbatim when short. For long spoken answers, light polish (remove filler words, smooth tics) while keeping the phrasing that makes it sound like Gen.
- Agent questions stay short and plain. No marketing language, no leading suggestions.
- Use `[VERIFY]` if a captured fact contradicts the research file or seems uncertain.
- Match Gen's review lexicon. Cross-reference `/vocabulary` for terms like "veiled," "snappy," "oomph," "holographic," "toe-tapping," and the rating-tier words "fair / good / great / outstanding."

## When to stop

Stop at the end of Phase 4. Gen has approved the summary, the overall thought is captured, and the recommendation is captured. The agent does not commit to a numeric four-dimension rating during the session. That belongs to Phase 3 (write), where Gen reviews and edits the prose.

If the session runs across multiple sittings, each sitting appends to the same file under a timestamped sub-heading rather than starting a new file.

## Anti-patterns

- Do not propose answers during probing ("So, would you say the bass is mushy?"). Ask neutrally, then capture.
- Do not paraphrase Gen's voice into neutral prose. Capture the words.
- Do not move to the next track or question on a one-word answer. Probe once, then move.
- Do not skip tracks or questions. If Gen has nothing to say, capture "no comment" and continue.
- Do not write the question text into the assessment file. Only Gen's answer.
- Do not commit to a final four-dimension rating during the session. That is Phase 3's job.
- Do not retroactively fix a wrong answer. Capture revisions when Gen changes their mind.
- Do not run git operations from this skill.

## Worked example

After the first session runs end-to-end against an IEM, look at the produced session file. Future sessions should match its structure and depth. No example exists yet at the time of writing.
