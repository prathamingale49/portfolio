# Altium PCB Portfolio

A static-first Next.js portfolio for PCB case studies built from web-friendly Altium Designer exports. It does not parse raw `.SchDoc` or `.PcbDoc` files.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX project wiki pages
- Static project content in `content/projects/[slug]`
- Generated/static assets in `public/generated/[slug]`

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Add A New Altium Project

1. Create `content/projects/[slug]/project.json`.
2. Create `content/projects/[slug]/wiki.mdx`.
3. Add exported schematic pages under `content/projects/[slug]/schematic`.
4. Add BOM and pick-and-place CSVs if useful.
5. Add lab images under `content/projects/[slug]/media`.
6. Add generated layout SVGs under `public/generated/[slug]/layout`.
7. Add a thumbnail under `public/generated/[slug]/thumbnails`.

Hotspots and layout callouts are manually defined in `project.json` using percentage-based coordinates from `0` to `100`.

## Altium Export Workflow

For each Altium PCB project, export:

1. Schematic PDF and/or SVG pages
2. Gerber files + NC drill files as a ZIP
3. BOM CSV
4. Pick-and-place CSV if useful
5. Stackup screenshot or text description
6. Board screenshots or SVG renders if Gerber rendering fails
7. Lab/test images
8. A `wiki.mdx` file explaining design purpose and validation

This site does not parse `.SchDoc` or `.PcbDoc` files.

Interactive schematic navigation is created using exported schematic pages plus manually defined hotspots in `project.json`.

PCB viewing is created using Gerber-derived or manually supplied SVGs.

Altium-like full net/component cross-probing is a future feature, not MVP.

## Schematic Viewer

Place schematic exports here:

```text
content/projects/[slug]/schematic/
```

Reference those files from `project.json` with paths such as:

```json
"/content/projects/[slug]/schematic/top-level.svg"
```

Each hotspot can:

- Switch to another schematic page with `type: "page"`.
- Jump to a wiki section with `type: "wiki"`.
- Open the right-side note panel with `type: "note"`.

## PCB Layout Viewer

Manual fallback files belong here:

```text
public/generated/[slug]/layout/top.svg
public/generated/[slug]/layout/bottom.svg
```

Reference those generated files from `project.json` with paths such as:

```json
"/generated/[slug]/layout/top.svg"
```

## Gerber Rendering

Put the Gerber and NC drill ZIP here:

```text
content/projects/[slug]/layout/gerbers.zip
```

Run:

```bash
npm run render:gerbers
```

The script currently checks each project for `gerbers.zip`, detects whether a local `tracespace` CLI is available, and fails softly into the manual SVG fallback. The intended output paths are:

```text
public/generated/[slug]/layout/top.svg
public/generated/[slug]/layout/bottom.svg
```

Known limitation: tracespace package and CLI integration can vary by package version and Gerber ZIP contents. For the MVP, the viewer is built to work reliably with manually provided `top.svg` and `bottom.svg`.

## Sample Project

The Recovery System sample includes:

- Placeholder schematic SVG pages
- The exported Altium schematic PDF as a source artifact
- Top/bottom board render SVGs
- BOM CSV
- Pick-and-place CSV
- Power bring-up, recovery driver test, and board-photo placeholders
- A navigable MDX wiki

Replace placeholders with real Altium exports as the design matures.
