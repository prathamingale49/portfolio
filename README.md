# Altium PCB Portfolio

A static-first Next.js portfolio for PCB case studies built from web-friendly Altium Designer exports. It does not parse raw `.SchDoc` or `.PcbDoc` files.

## Creation Disclosure

This website was created with the use of OpenAI Codex as a coding assistant. Project artifacts, engineering decisions, and design ownership should still be reviewed and maintained by the portfolio owner.

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
8. Add an optional Altium STEP export under `content/projects/[slug]/model`.
9. Add featured schematic/layout screenshots under `content/projects/[slug]/media` and reference them in `project.json`.

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
9. Optional STEP file for the 3D board viewer
10. Featured screenshots of circuit blocks, layout regions, and bring-up evidence

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

The script checks each project for extracted Gerber/drill files in `content/projects/[slug]/layout/gerbers`, runs `@tracespace/cli`, and writes composite top/bottom board renders to:

```text
public/generated/[slug]/layout/top.svg
public/generated/[slug]/layout/bottom.svg
```

For projects with mapped copper filenames in `tracespace.config.js`, the script can also emit stable copper-layer views:

```text
public/generated/[slug]/layout/copper-top.svg
public/generated/[slug]/layout/copper-1.svg
public/generated/[slug]/layout/copper-2.svg
public/generated/[slug]/layout/copper-3.svg
public/generated/[slug]/layout/copper-4.svg
public/generated/[slug]/layout/copper-bottom.svg
```

Known limitation: tracespace package and CLI integration can vary by package version and Gerber ZIP contents. The viewer still works with manually provided SVGs if automatic rendering fails.

## 3D STEP Viewer

Export a STEP model from Altium and place it in:

```text
content/projects/[slug]/model/
```

Reference it in `project.json`:

```json
"model3d": {
  "title": "Board 3D Model",
  "description": "Interactive board model from the Altium STEP export.",
  "stepFile": "/content/projects/[slug]/model/board.step"
}
```

The viewer uses Three.js and `occt-import-js` in the browser. If the STEP file is missing or cannot be loaded, the site shows an interactive placeholder board instead of breaking the page.

## Featured Screenshots

Add screenshots or exported images for important circuit/layout details under:

```text
content/projects/[slug]/media/
```

Reference them in `project.json`:

```json
"featured": [
  {
    "title": "Recovery Driver Bank",
    "description": "High-current deployment driver region.",
    "image": "/content/projects/[slug]/media/driver-bank.png",
    "tag": "Layout"
  }
]
```

## Sample Project

The Recovery System sample includes:

- Placeholder schematic SVG pages
- The exported Altium schematic PDF as a source artifact
- Six copper-layer board render SVGs
- BOM CSV
- Pick-and-place CSV
- Featured circuit/layout placeholders
- Optional STEP model slot
- A navigable MDX wiki

Replace placeholders with real Altium exports as the design matures.
