# In-ear Gems (blog)

Jekyll blog at <https://iegems.nk-tran.com/>. Personal-audio reviews
(IEMs, DACs, DAPs) by o0genesis0o / Gen.

The agent entry point is **[`AGENTS.md`](./AGENTS.md)**. It is a router, not an
instruction manual. AGENTS.md tells you **which** `.pi/skills/<name>/SKILL.md`
to load for the current task; the skill tells you **how** to do the work.

If you are writing or operating this repo, **read `AGENTS.md` first**, then
load the matching skill.

## Public pages (read these before writing)

- [`/philosophy`](https://iegems.nk-tran.com/philosophy) — voice, stance, why reviews are written the way they are.
- [`/methodology`](https://iegems.nk-tran.com/methodology) — the four rating dimensions, gate IEMs, the rubrics.
- [`/test-tracks`](https://iegems.nk-tran.com/test-tracks) — the canonical test track list with what each exposes.
- [`/vocabulary`](https://iegems.nk-tran.com/vocabulary) — words and phrases used in reviews.

## Build

The blog is built with Jekyll via Bundler.

- `make install`: installs Ruby dependencies (run once, or after `Gemfile` changes).
- `make serve`: runs `bundle exec jekyll serve -H 0.0.0.0 -P 3000` (depends on `install`).

A freshly written post is then at:

`http://localhost:3000/YYYY/MM/DD/slug/`

The build output goes to `_site/` (gitignored). `_config.yaml` edits require
a server restart.

## Tools

- **`tools/slideforge/`** — a Node CLI that generates the cover slides
  and the end-of-review summary image. Driven by an incremental JSON
  config (`assets/images/<product>/slideforge.json`). Run by the
  `iem-artwork` / `dac-artwork` / `dap-artwork` skills. See
  `tools/slideforge/README.md` for the full schema and CLI reference.