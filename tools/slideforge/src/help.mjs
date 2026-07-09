/**
 * CLI usage text.
 */
export function printUsage() {
  console.log(`slideforge - Generate PNG slides for iegems reviews.

Usage (agent-facing, for incremental JSON building):
  slideforge init <imageDir> --product "<name>" [--background <file>] [--graph <file>]
  slideforge set tagline    <imageDir> --text "..."   (or --unset)
  slideforge set summary    <imageDir> --text "..."   (or --unset)
  slideforge set background <imageDir> --file <file>
  slideforge set graph      <imageDir> --file <file>  (or --unset)
  slideforge set rating     <imageDir> --dimension "<name>" --score <0-5>   (or --unset --dimension "<name>")
  slideforge add section    <imageDir> --type <type> --images <file1[,file2,...]>
  slideforge remove section <imageDir> --index <n>    (or --last)
  slideforge build          <imageDir> [--outDir <dir>]
  slideforge show           <imageDir>

Other:
  slideforge serve   <imageDir> [--port <port>] [--open]
  slideforge example <imageDir>
  slideforge clean   <imageDir> [--scratch]

Commands:
  init             Create <imageDir>/slideforge.json with product + imageDir
                   (and optionally background + graph).
  set              Mutate a single metadata field. Valid subfields:
                     tagline, summary, background, graph, rating
                   Pass --unset to remove the field (or, for "set rating",
                   a single dimension; the whole rating is dropped when the
                   last dimension is removed).
  add section      Append a section. Validates type, image count, and that
                   every image file exists in <imageDir>. Throws on any failure.
  remove section   Delete a section by 0-based --index, or --last to drop
                   the trailing section.
  build            Generate slides.md, run slidev export, copy slide_*.png to
                   <imageDir> (or to --outDir if given).
  show             Pretty-print the current slideforge.json.
  serve            Spin up the slidev dev server against the generated slides.
  example          Write a sample slideforge.example.json template (full
                   schema with placeholders) into <imageDir>.
  clean            Remove generated slide_*.png from <imageDir>. With
                   --scratch, also remove the slidev build/serve scratch
                   dirs (tools/slideforge/scratch/_build_* and _serve_*).

Section types (see slideforge --types for the canonical list):
  design-vision, packaging, generic, frequency-response, frequency-response-comparison

A bare <imageDir> like "Performer8s" is resolved to
"assets/images/Performer8s/" relative to the current working directory.
Pass "./foo" or an absolute path to override.

Options:
  --product    Product display name (init).
  --background Filename of the hero background photo (init / set).
  --graph      Filename of the frequency-response graph (init / set).
  --text       Text value for set tagline / set summary.
  --file       Filename value for set background / set graph.
  --dimension  Dimension name for set rating (e.g. "Timbre and Tonality").
  --score      Score (0-5) for set rating.
  --unset      Remove a field (set tagline/summary/graph) or a dimension
               (set rating --dimension).
  --type       Section type for add section.
  --images     Comma-separated filenames for add section.
  --index      0-based section index for remove section.
  --last       Shorthand for "remove the last section".
  --outDir     Override output directory for build.
  --scratch    (clean) Also remove the slidev build/serve scratch dirs.
  --port       Port for the dev server (default 3030).
  --open       Open the dev server URL on start.
  -h, --help   Show this help.
`)
}
