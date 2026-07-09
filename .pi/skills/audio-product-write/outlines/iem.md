# IEM Review Outline

The canonical section structure for IEM reviews. Sections are mandatory unless the assessment genuinely has nothing to say on a topic.

Artwork placement is specified at the end of each section. The number of slides per section is flexible — use zero or more of each type depending on what is available and what fits the section's text length.

---

## 1. Forewords

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

Use "review sample from [Provider]" for tour/loan units, or "I purchased this unit on my own" for self-bought. For retail price, use the figure from the session file (or `[VERIFY]` if not confirmed).

---

## 2. In the Box

One or two paragraphs covering packaging and accessories. Itemise the contents (case, cable, tips, tools). End with a quick observation on the presentation.

**Artwork:** One `packaging` slide showing the box open or contents laid out. Caption: "In the box."

~150 words.

---

## 3. General Information

Two paragraphs covering the unit:
- Paragraph A: Driver configuration, technology, what the IEM is, what the manufacturer's marketing claims are (with a one-line translation of jargon-heavy claims).
- Paragraph B: Build quality, materials, dimensions, weight, cable specs, connector type, driveability notes.

Add a spec table. If the research file has an FR graph at `assets/images/<Folder>/<name>_Graph_Harman.png`, embed it here and reference the tonal observations from the session file's tonality section.

**Artwork:** One `design-vision` slide from the manufacturer's marketing material (brand story, design philosophy) if available. Caption: one-line factual description. Optional — skip if not available.

~250–400 words.

---

## 4. Experience

### 4.1 Physical Handling

Comfort during extended listening, fit and seal characteristics, cable quality, portability. Discuss anything that physically interfered with enjoyment (cable tangles, fit issues, weight, nozzle comfort, included tips).

Mine the session file's Non-sound aspects answers.

**Artwork:** One or more `generic` slides showing the IEM in hand or on-ear. Caption each: one-line factual description.

~250 words.

### 4.2 Sound Signature & Tonal Balance

The longest section in most reviews.

- One paragraph on overall signature (warm-neutral, neutral, V-shape, etc.), tying the listening impression to the FR graph if available.
- One paragraph per tonal region: bass, midrange, treble, sibilance handling. Pull from session file track notes where specific cues were tested.
- One paragraph on tuning options (if the IEM has switches, nozzles, or mechanical modes) or the lack thereof.

Reference at least one track per dimension from `/test-tracks`. At minimum: Shivers (sibilance), Kavakos Ciaccona (violin/decay), A Reckoning in Blood (dynamics), Memory (soundstage).

**Artwork:** One `frequency-response` slide showing the IEM's FR graph against a target. Mandatory. Caption: one-line observation tying the graph to the tonal description (e.g. "The graph confirms the slightly warm tilt, with a gentle dip through the upper midrange").

If the section is long and there are spare `generic` slides available, one may be added here as well.

~400–500 words.

---

## 5. Technical Performance

### 5.1 Resolution

Macro- and micro-resolution. Does the IEM survive complex mixes? Decay tails, breath, micro-detail. Reference `/test-tracks` for canonical cues. Place on the gate scale (Aria to Cantor) per the session file's Q&A answers.

**Artwork:** Zero or more `generic` slides. Caption each: one-line factual description. Skip if no relevant slides or if the section is short.

~200 words.

### 5.2 Soundstage & Imaging

Width, height, depth, holographic impression, imaging precision. Reference `/test-tracks` for canonical cues. Mark FPS gaming as "not tested, does not game" if Gen does not play.

**Artwork:** Zero or more `generic` slides. Caption each: one-line factual description. Skip if no relevant slides or if the section is short.

~150 words.

### 5.3 Bass Performance

Quantity vs quality, texture and grip, toe-tapping factor. Reference `/test-tracks` for canonical cues. Cross-reference physical handling notes if the IEM is hard to drive.

**Artwork:** Zero or more `generic` slides. Caption each: one-line factual description. Skip if no relevant slides or if the section is short.

~200 words.

---

## 6. Selected Comparisons

One to three IEMs, each ~150–200 words. Frame the IEM under review against the comparator on axes that differ between them. Use gate comparisons from the session file.

**Artwork:** For each comparison IEM, one `frequency-response-comparison` slide if an FR comparison graph for that pairing is available. Caption: "[Comparator name]." Skip if no comparison graph available.

---

## 7. Conclusions

```
Conclusions
===

<Gen's overall take, 1–3 paragraphs.>

**What I like about this IEM:**

- bullet
- bullet
- ...

**What could be improved:**

- bullet
- bullet
- ...

**Absolute Sonic Quality Rating: <score>/5 - <descriptor>**

- Timbre and tonality: <score>/5 - <descriptor>
- Bass and dynamic: <score>/5 - <descriptor>
- Resolution: <score>/5 - <descriptor>
- Soundstage and imaging: <score>/5 - <descriptor>

**Bias Score: <score>/5 - <descriptor>**
```

Fill ratings from the session file's Final Assessment section or from Gen's verbal close. If neither is present, ask Gen before inventing numbers.

**Artwork:** The summary slide (`slide_N.png`) from `iem-artwork` is mandatory here at the end of Conclusions, after the rating block. It is the closing image, not inline in a section.

If the section is long and there are spare `generic` slides available, one may be added here as well.

~300–400 words total (prose only; bullets and rating block are additional).
