---
name: audio-product-session
description: Phase 2 of the blog workflow. Run an interview-style listening session for an audio product (IEM, DAC, or DAP). Walks test tracks dim-by-dim, runs assessment Q&A from a question file (with inference from listening impressions before asking), gets Gen's final summary and recommendation, captures everything into a session file the write phase builds on.
---

# audio-product-session

This is **Phase 2** of the four-phase review workflow described in AGENTS.md. The session gathers subjective evidence the write phase lifts from: per-track listening impressions, answers to assessment questions, and Gen's final summary plus recommendation.

## Read first, every session

Before asking Gen anything, read these four pages in this order. They are the basis for speaking the same vocabulary and rating the same way Gen does:

1. `/philosophy`: voice, stance, why reviews are written the way they are, the calibration view, what tonality-is-preference means. The lens for everything below.
2. `/methodology`: the four rating dimensions (Timbre and Tonality, Bass and Dynamic, Resolution, Soundstage and Imaging), the gate IEM anchors (Aria, Blessing 2, Andromeda 2020, Cantor), the rubrics, how ratings appear at the end of a review.
3. `/vocabulary`: the canonical terms the agent and Gen both use, including Gen's particular terms (snappy, oomph, grippy, veil, holographic, toe-tapping, etc.) and the Sound Wheel lexicon.
4. `/test-tracks`: the canonical track list and what each track tests. The page is the source of truth; the agent does not maintain a parallel list.

If the agent cannot load any of these pages, say so and stop; do not improvise.

## The question file

The question file is the variable part of this phase. The skill is the invariant process. To update the assessment structure — add a section, add a question, change how ratings are anchored — edit the question file only. The skill reads and processes whatever the question file contains.

Three question files exist in `questions/`:
- `iem.md` for IEMs.
- `dac.md` for DACs.
- `dap.md` for DAPs.

Read the one matching the product under review before the Q&A phase.

### Question file format

Any `## ` heading in the question file defines a section. The skill mirrors this structure exactly in the output file — sections appear in the order the question file defines them. Any text before the first `## ` heading is ignored (use this for notes).

## Output

`_draft/<product-slug>/YYYY-MM-DD-session.md`

The research file `YYYY-MM-DD-research.md` should already exist in the same folder; if it does not, ask Gen whether to proceed or to run research first.

---

## Phase: Opening

One short opening message. Confirm:

- Product under test (full name and SKU if applicable).
- Rig: for IEMs, sources + cables + ear tips + listening volume. For DAC / DAP, IEMs or headphones used to drive it + the baseline source for comparison.
- Music library or playlist used.
- Burn-in status of the unit (for IEMs) or firmware version (for DAPs / DACs).
- Any known caveats (e.g., unit is half-broken, ear tips are not the final pair).

Capture this into an opening block at the top of the session file. This is context only; it does not appear in the published review.

---

## Phase: Listening Test

Pull cues from `/test-tracks` (a public page in this repo). The page is canonical; the agent does not maintain a parallel track list. Walk tracks in the dimension grouping order the page specifies.

**Per track:**

1. Tell Gen the next track. Include track name, artist, and the page's stated cue for that track.
2. Wait for Gen's response.
3. Capture verbatim into one paragraph under a track header in the file. Include the track metadata (song, artist, link) at the start of the paragraph.
4. If Gen's response is short, probe once with a follow-up like "Where in the track is that most obvious?", "Is that the upper-midrange or the treble?", "How does it compare to [reference] for that cue?". Do not probe twice.
5. If Gen has nothing to say, capture "no comment" and move on. Do not skip tracks.

---

## Phase: Q&A

Read the question file. Discover its section headings and questions. Read any metadata block at the top of the file before asking questions.

Walk section by section. Within each section, walk question by question.

**Per question:**

1. **Infer first.** Try to answer the question from Gen's listening impressions captured in the Listening Test plus any answers already given in this session. If you can construct a defensible answer, show it to Gen as a draft and ask if it matches, with an offer to refine.
2. **Ask only if you cannot infer.** Pose the question once, neutrally. Probe once if the answer is vague. Move on regardless of answer quality once Gen has said something.
3. **Capture verbatim under the appropriate section heading.** Do not write the question text in the file. Only the answer.
4. Continue to the next question.

**Section structure in the output file.** Mirror the question file's section headings exactly, in the same order. Within each section, answers are bullet points or short paragraphs. One answer per question, in the question's order.

---

## Phase: Final Assessment

1. **Draft a summary.** Based on all listening impressions and Q&A answers captured so far. Show the draft to Gen.
2. **Iterate.** Gen edits, corrects, or extends. Capture the iteration in the chat but do not write to the file yet.
3. **Capture final version.** When Gen says the summary is right, write it into `## Final Assessment > ## Summary`.
4. **Overall thought.** Ask Gen for one to three sentences capturing their final overall impression. Capture verbatim into `## Final Assessment > ## Overall thought`.
5. **Recommendation.** Ask Gen whether and for whom they recommend the product. Capture verbatim into `## Final Assessment > ## Recommendation`.
6. Notify Gen that the assessment is complete.

---

## Output file structure

```
# <Product Name> assessment

## Opening

<setup notes, context only — does not appear in the published review>

## Listening Test

### <Track name> by <Artist>

<YouTube link>

<Gen's paragraph of impressions, verbatim>

(... repeated for each track ...)

## Assessment

### <Section 1 from question file>

- <answer 1, verbatim>
- <answer 2, verbatim>
- ...

### <Section 2 from question file>

- ...

(... sections match question file headings, in order ...)

## Final Assessment

### Summary

<Gen's approved summary>

### Overall thought

<Gen's 1-3 sentence conclusion, verbatim>

### Recommendation

<Gen's recommendation, verbatim>
```

---

## Voice rules

- No em-dashes anywhere in the file. Use commas or restructure.
- Capture Gen's voice, not the agent's. Verbatim when short. For long spoken answers, light polish — remove filler words and smooth tics while keeping the phrasing that makes it sound like Gen.
- Agent questions stay short and plain. No marketing language, no leading suggestions.
- Use `[VERIFY]` if a captured fact contradicts the research file or seems uncertain.
- Match Gen's review lexicon. Cross-reference `/vocabulary` for terms like "veiled," "snappy," "oomph," "holographic," "toe-tapping," and the rating-tier words "fair / good / great / outstanding."

---

## Anti-patterns

- Do not propose answers during probing ("So, would you say the bass is mushy?"). Ask neutrally, then capture.
- Do not paraphrase Gen's voice into neutral prose. Capture the words.
- Do not move to the next question on a one-word answer. Probe once, then move on.
- Do not skip questions. If Gen has nothing to say, capture "no comment" and continue.
- Do not write question text into the assessment file. Only Gen's answer.
- Do not retroactively fix a wrong answer. Capture revisions when Gen changes their mind.
- Do not run git operations from this skill.
- Do not commit to the final numeric rating block during this phase. Assembling and approving the ratings belongs to Phase 3 (write). Collecting dimension scores via Q&A questions is fine and expected.
