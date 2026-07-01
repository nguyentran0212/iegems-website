# DAP Review Outline

The canonical section structure for DAP reviews. The agent walks these in order. DAP outlines are heavier than IEM or DAC outlines because of the OS layer.

## 1. Preambles

Static template. Same source-thinking language as DAC reviews (`dac-review-write/SKILL.md`). Variable fields: provider, manufacturer, retail price, URL.

## 2. General Information

Heavy section. Three typical paragraphs:

**Paragraph A: Product line positioning.** If the DAP sits in a manufacturer's product family (HiBy has many models, see R6 Pro Max), walk the family from entry-level to TOTL to establish where the unit sits. This context for the reader is what makes the review different from a generic spec sheet.

**Paragraph B: Audio side.** DAC chip, amplifier stage, signal-path architecture, output power per port, output impedance, gain levels. Reference frequency response or SNR claims as vendor marketing, with quick translation.

**Paragraph C: Android side and physical.** SoC, RAM, storage, screen size and resolution, OS version, body material, dimensions, weight, color options, ports.

Two spec tables embedded as images if the research file captured spec-sheet images.

400-700 words.

## 3. Functionality

Each major operating mode gets a sub-section. Typical modes for Android DAPs:

- **Android Mode.** Stock Android experience, app access, streaming apps, web browser. Note Snapdragon 665-era performance and whether the SoC is still adequate.
- **Pure Audio Mode** (or "Music Mode"). HiBy / A&K / others. Locks the device to the music app for bit-perfect focus.
- **USB DAC Mode.** Unit as a USB DAC for a computer. Latency is the typical weak point.
- **Bluetooth Mode.** Send (DAP as source to BT headphones) and receive (DAP as BT DAC from phone). Codec support.

Each sub-section: ~100-150 words describing the mode and what Gen observed. Note any quirks (the R6 Pro Max review caught the Pure Audio Mode as "probably just tweaked Android").

250-500 words.

## 4. Software

Android customisation, audio stack, EQ, DSP plugins. Cover:

- OS customisation depth (HiBy OS, A&K, etc.).
- System-wide SRC bypass and bit-perfect playback.
- Audio stack: gain, low-pass filter, channel balance, max volume.
- MSEB (HiBy's parametric EQ disguised as subjective sliders) if applicable.
- PEQ (full parametric EQ) with overlay UI.
- DSP plugins: convolution filter, dynamic adjustment (e.g. DRX10K).
- Support settings: DSD gain, MQA decoding, SPDIF/USB volume lock.

Pull from the assessment file's Functional/Software section. The tone here allows some of Gen's playful commentary (e.g., the "somewhat addicting game" line about PEQ on R6 Pro Max). Don't pretend to be neutral when Gen has a clear opinion.

300-500 words.

## 5. Battery Life

Three sub-sections typically:

- **Runtime.** AccuBattery or similar app data, 1-hour mixed-workload test, listing source settings (gain, volume, IEM tested). Predict total runtime from the per-hour drain.
- **Standby.** Real-world anecdote (R6 Pro Max's "two weeks of intermittent use" example). Drift if not good.
- **Charging.** Max wattage measured, time-to-full with the relevant charger (often the bundled 65W GaN or similar).

Real numbers throughout. Vendor claims are contestable.

250-500 words.

## 6. Sonic Performance

Test setup block first: IEMs used, sources compared against, volume calibration method (e.g. 73 dB pink noise coupler match).

Then the perception paragraphs:
- Overall signature: how the unit changes the IEMs it drives. "Pitch black background," "dynamic swing," transient incisiveness are common Gen observations.
- Sub-section per comparison (Apple dongle, R3II, DX300, FD5, etc.): ~150-200 words each.

Heavy use of track callouts. Reference Ciaccona (Kavakos) for violin and micro-detail, Memory (Gundam) for staging, A Reckoning in Blood for dynamics, Shivers for harshness.

Pair with multiple IEM classes to cover driveability. Standard sequence: easy drive, high-sensitivity, low-impedance low-sensitivity. R6 Pro Max did Andromeda 2020 and E5000.

500-800 words.

## 7. Concluding Remarks

Three-paragraph overall take in Gen's voice. Then the bullet lists:

**What I like about this device:**
- bullet
- ...

**What could be improved:**
- bullet
- ...

Then the four-dimension rating block plus Bias Score:

**Absolute Sonic Quality Rating: <score>/5 - <descriptor>**
- Timbre and tonality: <score>/5 - <descriptor>
- Bass and dynamic: <score>/5 - <descriptor>
- Resolution: <score>/5 - <descriptor>
- Soundstage and imaging: <score>/5 - <descriptor>

**Bias Score: <score>/5 - <descriptor>**

Scoring convention: 1-5 in 0.5 increments on the dimensions, integer 1-5 on Bias Score. Descriptors follow the methodology scale (outstanding, great, good, not enjoyable, train wreck).

If the assessment file has a "Closing take" or "Final Assessment" section, draw from it.

300-500 words.
