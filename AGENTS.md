# AGENTS.md

## What this repo is

This is the Jekyll blog "In-ear Gems," published at https://iegems.nk-tran.com/. The blog reviews personal audio products: mostly IEMs, plus DACs and DAPs. The author writes under the alias o0genesis0o (also known as ie-gems).

The voice and stance of the blog are captured on the public `/philosophy` page. **If you don't read anything else in this repo, read that page first.** It explains why reviews are written the way they are, what the four rating dimensions actually mean, and where the line is between preference and engineering quality.

## Build and run locally

The blog is built with Jekyll via Bundler:

- `make install`: installs Ruby dependencies (run once, or after `Gemfile` changes).
- `make serve`: runs `bundle exec jekyll serve -H 0.0.0.0 -P 3000` (depends on `install`).

After `make serve`, a freshly written post is reachable at:

`http://localhost:3000/YYYY/MM/DD/slug/`

The build output goes to `_site/`, which is gitignored. Changes to `_config.yaml` require a server restart.

## Site structure

- **`_posts/`**: published reviews and impressions. Naming: `YYYY-MM-DD-review-Brand-Model.md` for reviews, `YYYY-MM-DD-impressions-Brand-Model.md` for impressions. Anything in this folder is rendered on the site.
- **`_draft/`**: templates, raw fragments, and per-product working folders. **Nothing in `_draft/` is published.** Two sub-conventions:
  - Top-level `_draft/` files are templates and snippet fragments (no front-matter).
  - `_draft/<product-slug>/` folders hold working files for one specific product (research file, session notes). The slug is a lowercase, hyphenated version of the product name (e.g., `aful-performer8s`).
- **`assets/images/<IEM_Folder>/`**: per-product image folders. Recent posts use numbered filenames (`1.jpg`, `2.jpg`, ...). Older posts use descriptive names.
- **Top-level pages**: `philosophy.md`, `methodology.md`, `test-tracks.md`, `vocabulary.md`, `about.markdown`, `collection.md`, `index.html`.
- **`_config.yaml`**: site config (title, theme, plugins, defaults). Editing requires a server restart.
- **`_data/navigation.yml`**: nav menu. Currently: Collection and Impressions, Review Method, Ranking Database, About. Test Tracks and Vocabulary are referenced from their pages but not in the nav (limited visual space).

## The four-phase workflow

Reviews are produced in four phases. Each phase ends with Gen's review and approval before the next starts. The agent never runs more than one phase per turn.

| Phase | Skill to load | Trigger |
|-------|---------------|---------|
| 1. Research | `audio-product-research` | "look up X" / "research X" / a URL or product name |
| 2. Assessment session | `audio-product-session` | "let's do the listen session for X" |
| 3. Write | `audio-product-write` | "write up X" / "draft the X review" |
| 3b. Artwork | `audio-product-artwork` | invoke from inside the write phase, after sections are drafted |
| 4. Publish | `blog-publish` | "ship X" / "publish X" |

**Phase 1: Research.** Output: `_draft/<product-slug>/YYYY-MM-DD-research.md`. Sources: manufacturer page, vendor store, public FR measurement (sqig.link / nk-tran.com/iegems-graphtool / oratory1990 archive), Head-Fi official thread. Anything that can't be cited publicly is marked `[VERIFY]`. Gen fills those in or confirms.

**Phase 2: Assessment session.** Output: `_draft/<product-slug>/YYYY-MM-DD-session.md`. Walks test tracks dim-by-dim per `/test-tracks`. Then A/B comparison against the gate IEM closest to the new unit (Aria, Blessing 2, Andromeda 2020, Cantor for ascending bands). Then a wrap interview on comfort, handling, driveability, value. The session file is the raw material for Phase 3.

**Phase 3: Write.** Loads research + session. Drafts to `_draft/YYYY-MM-DD-review-<BrandModel>.md` (or impressions file). Gen reads, marks up, iterates. When approved, the file moves to `_posts/`.

**Phase 3b: Artwork.** Gen supplies the product photos, the FR chart, and any relevant artwork from the manufacturer or retailer. The `audio-product-artwork` skill drives `tools/slideforge/` to render the cover slides and the summary image, and the agent inserts the generated artwork into the written review. The skill handles all product types (IEM, DAC, DAP) and specifies which artwork to generate and where each piece belongs.

**Phase 4: Publish.** Confirms the file is in `_posts/`, the image folder is present, the front-matter is valid. Optionally starts `make serve` if not running. Shows the preview URL. On Gen's explicit "go": `git add`, commit, push. Never auto-publishes.

## Public page references

These pages document the blog's substantive content. Use them when you need the answer; do not duplicate their content here.

- `/philosophy`: voice, stance, why reviews are written the way they are.
- `/methodology`: the four rating dimensions, gate IEMs, how ratings appear in a review, the rubrics.
- `/test-tracks`: the canonical list of test tracks with what each tests and YouTube links.
- `/vocabulary`: words and phrases used in reviews, including the Sound Wheel lexicon and Gen's particular terms.

## Mandatory: load skills before working

**Before doing any review-related work in this repo, load the matching skill from `.pi/skills/`.** The review phase skills are:

- `.pi/skills/audio-product-research/` — Phase 1: research a product
- `.pi/skills/audio-product-session/` — Phase 2: run the listening interview
- `.pi/skills/audio-product-write/` — Phase 3: draft the review (uses product-specific outlines for IEM, DAC, DAP)
- `.pi/skills/blog-publish/` — Phase 4: publish to the live site
- `.pi/skills/audio-product-artwork/` — Phase 3b: generate cover slides and summary image; activated from inside the write phase

The `SKILL.md` files inside each are the source of truth for voice, vocabulary use, disclosure language, anti-patterns, graph conventions, and writing rules. AGENTS.md tells you which skill to load for which phase. The skills tell you how to do the work in Gen's voice.

If you find yourself reaching for a writing style, disclosure pattern, or workflow detail not described in the skill you loaded, **stop and load the relevant skill**, do not improvise. The skills are authoritative for this repo. AGENTS.md is a router, not an instruction manual.

## Tools

- **`tools/slideforge/`** — generates the cover slides and the end-of-review summary image. CLI under `bin/slideforge.mjs`; full schema and usage in `tools/slideforge/README.md`. The `audio-product-artwork` skill drives this tool.
