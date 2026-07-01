---
name: blog-publish
description: Phase 4 of the blog workflow. Publish a Gen-approved review to the live site. Verifies the post file and image, optionally runs make serve for a preview, and on Gen's explicit "go" commits and pushes to the remote.
---

# blog-publish

This is **Phase 4** of the four-phase review workflow described in AGENTS.md. The skill moves an already-approved post from `_draft/` (or wherever) into `_posts/`, validates it, lets Gen preview locally, and on Gen's explicit "go" commits and pushes to the remote.

The skill does NOT write reviews or do creative work. By the time it runs, the post is approved and Gen's only remaining decision is whether to push it live now.

## Activate when

Gen says "ship X", "publish X", "push X", or names a post file at `_posts/...` and asks for it to be published.

## Read first

None mandatory. The file has been written and approved by Gen before this phase runs. Read it once during pre-flight to run the validation passes.

## Output location

The published post lives at `_posts/YYYY-MM-DD-review-<BrandModel>.md` (matches the project convention). After the post is in `_posts/`:

- Index listings get refreshed on the next Jekyll build.
- Image references resolve from `/assets/images/<Folder>/<image>` via the post's `header.image` and inline `<img>` tags.

## Workflow

### 1. Confirm the file is in `_posts/`

Verify the post is at `_posts/`, not in `_draft/`. If the file is in `_draft/`, the file path was not moved during approval. Either move it now (if Gen already approved it) or stop and ask.

### 2. Pre-flight validation

Run these checks before showing the preview URL.

**Frontmatter is valid YAML.** Open the file, parse the frontmatter block. Required keys:

- `title` (string)
- `layout: single`
- `excerpts` (typo preserved across the blog; do NOT "fix" it)
- `toc: true`
- `header.image` (string, `/assets/images/<Folder>/<file>` pattern)

If any required key is missing or malformed, stop and flag.

**No draft markers.** Confirm the post is not draft-flagged. `published: false` or `draft: true` would prevent Jekyll from rendering.

**Image folder exists.** Walk the path declared in `header.image`. The folder is `assets/images/<Folder>/`. If the folder is missing, the image will 404. If the specific image file is missing, also flag.

If `assets/images/<Folder>/` has no files at all, flag for Gen.

**No em-dashes.** Grep the file for the em-dash character (U+2014). If any exist, the agent did not catch them in the write-phase final assembly. Flag and ask Gen how to handle: fix in place and re-commit, or publish as-is. Stop if the count is large.

**Filename date matches frontmatter date.** If the file has a YAML `date:` key, it should match the `YYYY-MM-DD` prefix in the filename. Mismatch is a sign the post was renamed during drafting without updating the date.

### 3. Optional: start Jekyll for preview

If Gen wants a preview:

- Run `make serve` if not already running (it listens on port 3000 per AGENTS.md).
- Confirm the post is reachable at `http://localhost:3000/YYYY/MM/DD/<slug>/`.
- Report the URL to Gen.

If Gen does not want a preview, skip this step. The skill should not assume a preview is mandatory.

### 4. Wait for Gen's "go"

This is the only point where the skill asks for permission to push. Never commit without an explicit "go". Phrasings that count as "go": "ship it", "publish", "push", "go", "yes", "looks good, push it". Phrasings that do NOT count: "looks good" (too ambiguous; "looks good, ship it" does), silence, suggested edits, "hold for now".

If Gen replies with feedback on the post itself rather than a clear "go", treat as not-yet-approved. Show that the post is staged but not committed. Wait for explicit "go".

### 5. Git operations on "go"

The push sequence:

1. `git status` and `git diff --stat` to show what is staged or modified. Report any unexpected changes (unrelated to the post) before proceeding.
2. `git add <post-file-path>` plus any new image files in `assets/images/<Folder>/` that are not yet tracked.
3. Do not `git add .` or `git add -A`. Always scope the add to the specific files.
4. `git commit` with a message in the form `YYYY-MM-DD: <slug>` (e.g., `2026-07-01: aful-performer8s`). One post per commit.
5. `git push origin <branch>` where `<branch>` is the branch the blog builds from. Default `main`. If GitHub Pages builds from a different branch (rare in this repo, but worth checking on first run), adjust and note.
6. After push, GitHub Pages builds the site on its own. The agent does not need to trigger a build manually. Report the commit hash and the push output URL to Gen.

### 6. Report

After the push, give Gen:

- The commit hash.
- The push output (`git push` last line, typically a GitHub link like `https://github.com/<owner>/<repo>/commit/<hash>`).
- A note on what triggers the live deploy (GitHub Pages rebuild from the push).
- The preview URL again if `make serve` was started, so Gen can refresh and see the post live.

## Anti-patterns

- Do not push without Gen's explicit "go".
- Do not use `git add .` or `git add -A`. Scope the add to the specific files.
- Do not commit unrelated files. If `git status` shows other modifications, flag them and ask Gen whether to fold them into the commit or leave them out.
- Do not "fix" the `excerpts` typo in frontmatter. The blog uses `excerpts` (with an s) intentionally across all posts. If you think this is a bug, ask Gen before changing.
- Do not re-run `make serve` if it is already running. Check first.
- Do not push when there is an unresolved `[VERIFY]` in the post body. Resolve or strip before commit.
- Do not edit the post file during this phase. Phase 3 (write) edits; Phase 4 publishes. If Gen wants edits, move back to write phase.

## Worked example

After the first publish with this skill lands, look at the produced commit in `git log`. Future publishes should match the commit message format `YYYY-MM-DD: <slug>`. The git history of the project (`git log --oneline | head -30`) shows the existing pattern of one-commit-per-post with date and slug, and the agent's commits should match that convention.
