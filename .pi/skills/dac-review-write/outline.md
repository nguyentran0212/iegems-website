# DAC Review Outline

The canonical section structure for DAC reviews. The agent walks these in order. Skip only if the assessment has nothing meaningful to say for a given section.

## 1. Preambles

Static template. Use the canonical wording from the skill instructions. Variable fields: provider, manufacturer, retail price, URL.

Note: DAC reviews use "Preambles" rather than "Forewords". Older 2023 DAC reviews used the ASCII `===` underline. Newer reviews use `##` headings. Pick the style that matches the most recent DAC review.

## 2. General Information (or Specs)

In the modern convention, this section combines specs and architecture into one block:

- One paragraph on the DAC chip, amplifier stage, and any signal-path architecture. Reference frequency response claims as vendor marketing, then translate.
- One paragraph on physical design: chassis material, dimensions, weight, ports (USB in, headphone out, line out, balanced, single-ended), switch positions or gain levels if applicable.
- A spec table or, if the vendor page leaves the spec sheet as image-only, a `[VERIFY]` block listing the spec items not yet confirmed.

If the unit sits in a manufacturer's product family (e.g., a higher or lower sibling), Gen sometimes walks the family up front. Reference W4 and R6 Pro Max as examples.

300-400 words.

## 3. Non-sound Aspects

For portable DACs, this is often the longest section. Covers:

- Build quality and design language.
- Controls (volume knob, gain switch, low-pass filter switch, display).
- Connectivity (USB-C, optical, coax, Bluetooth in/out, LDAC support, etc.).
- Power delivery, charging, battery drain from host device.
- Software or app features (DSP, EQ, filter switching) if any.
- Compatibility testing across devices (Windows, macOS, Android, iOS, Linux). Note any rough edges.

Pair-and-pair testing note: which IEMs were used to drive the unit during sound testing. List them in a "Test setup:" block at the top of the next section.

300-500 words.

## 4. Sound Performance

Two opening blocks:

**Test setup:** Sources used, IEMs tested, cables, ear tips, volume calibration (how loud was the test, how was it measured, e.g. 73 dB pink noise coupler match).

**Perceived Tonality:** ~200 words on whether the unit adds or removes anything from the signal, and on the tonal character of the changes. Reference Harman / Diffuse Field positions if relevant. Cite test tracks (`/test-tracks`) where appropriate.

**Perceived Technical Performance:** ~200-300 words on staging, depth, dynamics, micro-detail, separation. Same track references.

For sources that primarily drive IEMs, include **Driveability** sub-section(s) covering performance across IEM classes (easy-to-drive, high-sensitivity, low-impedance low-sensitivity, high-impedance). Each driver class tests a different aspect:
- Easy-to-drive IEMs (e.g. 64 Audio U12T): whether the source is at least as good as Apple dongle.
- High-sensitivity / low-impedance IEMs (e.g. CFA Andromeda 2020, Final A4000): hiss, background noise floor, micro-dynamics.
- Low-sensitivity IEMs (e.g. Final Audio E5000): current delivery, bass quality under load, dynamic headroom.
- High-impedance transducers (e.g. 300-ohm planar earbuds or full-size headphones): does the unit have enough voltage swing?

Total Sound Performance: 500-800 words. Plus the driveability tests as nested subsections.

## 5. (Selected) Comparisons

Optional but standard for DAC reviews. Common baselines:

- The Apple dongle as the no-cost reference point.
- A flagship DAP or DAC as the high-end reference.

For each comparison, name the comparator, the gear used (same IEM, same track, volume-matched), what differs. ~150-200 words per comparison.

When the comparison shows the unit is *worse* than the comparator on some axis, name it. Gen does not flinch from negative findings (W4 did this on idle battery drain).

## 6. Conclusion

One or two paragraphs of overall take in Gen's voice. Then the bullet lists:

**Pros:**
- bullet
- ...

**Cons:**
- bullet
- ...

(Older format. Newer format uses "What I like about this device" / "What could be improved" per the IEM convention. Pick the style that matches the most recent DAC review in the project.)

If the four-dimension rating block is used, place it after the bullet lists. Otherwise, give an overall absolute rating in the conclusion prose.

300-500 words total.
