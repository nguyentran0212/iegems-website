/**
 * Slidev runner.
 *
 * `prepareScratchDir` writes the slidev project (slides.md + style.css +
 * vite.config.js + slide-bottom.vue + components/ + public/ symlinks) into
 * a scratch directory. The static files come from `tools/slideforge/templates/`.
 *
 * `runSlidevBuild` invokes `slidev export --format png` against the project
 * and returns the produced PNG paths.
 *
 * `runSlidevServe` spawns `slidev` (dev server) so the user can preview the
 * slides in a browser before exporting. Blocks until Ctrl-C.
 */

import { spawn } from 'node:child_process'
import {
  mkdir,
  symlink,
  readdir,
  copyFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PKG_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(PKG_ROOT, '..', '..')
const SLIDEV_BIN = path.join(PKG_ROOT, 'node_modules', '.bin', 'slidev')
const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates')

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
      ...opts,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

/**
 * Spawn slidev with stdio inherited so the user can interact (Ctrl-C etc.).
 * Returns a Promise that resolves when the child exits cleanly.
 */
function spawnInteractive(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      ...opts,
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0 || code === null) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

async function ensureSymlink(target, linkPath) {
  await rm(linkPath, { recursive: true, force: true }).catch(() => {})
  await symlink(target, linkPath)
}

async function copyTemplateFile(relPath, scratchDir) {
  const src = path.join(TEMPLATES_DIR, relPath)
  const dst = path.join(scratchDir, relPath)
  await mkdir(path.dirname(dst), { recursive: true })
  await copyFile(src, dst)
}

/**
 * Write the slidev project files into scratchDir. Idempotent (overwrites).
 */
export async function prepareScratchDir({
  scratchDir,
  markdown,
  imageDir,
  imageDirBase,
}) {
  await mkdir(scratchDir, { recursive: true })

  // slides.md (front matter + generated slides).
  await writeFile(path.join(scratchDir, 'slides.md'), markdown, 'utf8')

  // Static template files.
  await copyTemplateFile('style.css', scratchDir)
  await copyTemplateFile('vite.config.js', scratchDir)
  await copyTemplateFile('slide-bottom.vue', scratchDir)
  await copyTemplateFile('components/RatingBar.vue', scratchDir)
  await copyTemplateFile('components/DimensionRadar.vue', scratchDir)

  // public/ - symlink the logo and the source image dir so <img src="..."/> resolves.
  const publicDir = path.join(scratchDir, 'public')
  await mkdir(publicDir, { recursive: true })

  const logoSrc = path.join(REPO_ROOT, 'assets', 'images', 'In-ear-gems-2.png')
  await ensureSymlink(logoSrc, path.join(publicDir, 'logo.png'))

  await ensureSymlink(imageDir, path.join(publicDir, imageDirBase))
}

export async function runSlidevBuild({
  scratchDir,
  markdown,
  imageDir,
  imageDirBase,
  logger = console,
}) {
  await prepareScratchDir({ scratchDir, markdown, imageDir, imageDirBase })

  const outDir = path.join(scratchDir, 'out')
  await mkdir(outDir, { recursive: true })

  const slidesPath = path.join(scratchDir, 'slides.md')
  logger.log(`slideforge: building slidev project at ${scratchDir} ...`)
  await run(SLIDEV_BIN, [
    'export',
    slidesPath,
    '--format',
    'png',
    '--output',
    outDir,
    '--per-slide',
  ], { cwd: scratchDir })
  logger.log(`slideforge: build complete, outputs at ${outDir}`)

  const pngs = (await readdir(outDir))
    .filter((f) => f.endsWith('.png'))
    .sort((a, b) => {
      const an = parseInt(a.replace(/\.png$/, ''), 10)
      const bn = parseInt(b.replace(/\.png$/, ''), 10)
      return an - bn
    })
    .map((f) => path.join(outDir, f))
  return pngs
}

export async function runSlidevServe({
  scratchDir,
  markdown,
  imageDir,
  imageDirBase,
  port = 3030,
  open = false,
}) {
  await prepareScratchDir({ scratchDir, markdown, imageDir, imageDirBase })

  const slidesPath = path.join(scratchDir, 'slides.md')
  console.log(`slideforge: slidev dev server starting at ${scratchDir} ...`)
  console.log(`           navigate to http://localhost:${port}/ once it's up.`)
  await spawnInteractive(
    SLIDEV_BIN,
    [slidesPath, '--port', String(port), ...(open ? ['--open'] : [])],
    { cwd: scratchDir },
  )
}