# PCB Portfolio

A static-first Next.js portfolio for PCB case studies built from web-friendly Altium exports. It is meant to present engineering work, schematic PDFs, Gerber-derived layout renders, 3D board models, and MDX design notes. It does not parse raw `.SchDoc` or `.PcbDoc` files.

## Creation Disclosure

This website was created with the use of OpenAI Codex as a coding assistant. Project artifacts, engineering decisions, and design ownership should still be reviewed and maintained by the portfolio owner.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX project wiki pages
- Three.js board model viewer
- Static project content in `content/projects/[slug]`
- Generated layout assets in `public/generated/[slug]`

## Current Projects

All project pages are currently marked under construction while final descriptions, screenshots, and board exports are being refined.

- Recovery System
- RF Link Evaluation Board
- Vespula Avionics Module
- Darcy Battery Management System
- Flight Computer
- Darcy Umbilical
- Hardware in the Loop

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run lint
npm run build
```

## Add A New Altium Project

1. Create `content/projects/[slug]/project.json`.
2. Create `content/projects/[slug]/wiki.mdx`.
3. Add exported schematic PDFs or SVG pages under `content/projects/[slug]/schematic`.
4. Add Gerbers, NC drill files, BOM CSV, and pick-and-place CSVs under `content/projects/[slug]/layout`.
5. Add generated layout SVGs under `public/generated/[slug]/layout`.
6. Add GLB and optional STEP models under `content/projects/[slug]/model`.
7. Add screenshots, lab photos, oscilloscope captures, or thermal images under `content/projects/[slug]/media`.
8. Reference all public-facing assets in `project.json`.

Hotspots and layout callouts are manually defined in `project.json` using percentage-based coordinates from `0` to `100`.

## Altium Export Workflow

For each Altium PCB project, export:

1. Schematic PDF and/or SVG pages
2. Gerber files + NC drill files as a ZIP or extracted folder
3. BOM CSV
4. Pick-and-place CSV if useful
5. Stackup screenshot or text description
6. Board screenshots or SVG renders if Gerber rendering fails
7. GLB model for fast browser previews
8. STEP model as an optional source/download artifact
9. Lab/test images
10. A `wiki.mdx` file explaining design purpose and validation

This site does not parse `.SchDoc` or `.PcbDoc` files.

Interactive schematic navigation is created using exported schematic PDFs/SVGs plus manually defined hotspots in `project.json`. When a schematic PDF already has internal sheet links, the schematic viewer can embed the PDF directly and let the browser PDF viewer handle those links.

PCB viewing is created using Gerber-derived SVGs or manually supplied SVGs. Altium-like full net/component cross-probing is a future feature, not MVP.

## Project Metadata

Each project uses a typed `project.json` file. The main fields are:

- `slug`, `title`, `subtitle`, `summary`
- `category`, `role`, `tools`, `tags`
- `layerCount`, `stackup`
- `keyComponents`, `mainConstraints`, `highlights`
- `model3d` for GLB/STEP model assets and default camera/orientation values
- `schematic.pages` for schematic PDFs or SVG sheets
- `layout.views` for top, bottom, and copper layer SVGs
- `featured` for highlighted circuit/layout screenshots

Project dates are intentionally not shown in the project cards or project pages.

## Schematic Viewer

Place schematic exports here:

```text
content/projects/[slug]/schematic/
```

Reference those files from `project.json` with paths such as:

```json
"/content/projects/[slug]/schematic/schematic.pdf"
```

For SVG sheets, hotspots can:

- Switch to another schematic page with `type: "page"`.
- Jump to a wiki section with `type: "wiki"`.
- Open a note panel with `type: "note"`.

For PDF schematics, the viewer hides the custom sidebar by default and relies on the embedded PDF's own page links when available.

## PCB Layout Viewer

Generated or manually supplied layout files belong here:

```text
public/generated/[slug]/layout/top.svg
public/generated/[slug]/layout/bottom.svg
public/generated/[slug]/layout/copper-top.svg
public/generated/[slug]/layout/copper-1.svg
public/generated/[slug]/layout/copper-2.svg
public/generated/[slug]/layout/copper-bottom.svg
```

Six-layer boards can also include:

```text
public/generated/[slug]/layout/copper-3.svg
public/generated/[slug]/layout/copper-4.svg
```

The layout viewer supports pan, toolbar zoom, scroll-wheel zoom, reset, top/bottom views, individual copper-layer views, and optional callouts from `project.json`.

## Gerber Rendering

Put Gerber and NC drill exports here:

```text
content/projects/[slug]/layout/gerbers/
```

or keep a ZIP such as:

```text
content/projects/[slug]/layout/gerbers.zip
```

Run:

```bash
npm run render:gerbers
```

The script checks each project for Gerber/drill files, runs `@tracespace/cli`, and writes composite top/bottom board renders to:

```text
public/generated/[slug]/layout/top.svg
public/generated/[slug]/layout/bottom.svg
```

It can also emit stable copper-layer views when the project's copper filenames are mapped by the render pipeline:

```text
public/generated/[slug]/layout/copper-top.svg
public/generated/[slug]/layout/copper-1.svg
public/generated/[slug]/layout/copper-2.svg
public/generated/[slug]/layout/copper-3.svg
public/generated/[slug]/layout/copper-4.svg
public/generated/[slug]/layout/copper-bottom.svg
```

Known limitation: tracespace output depends on Gerber naming, drill exports, and package behavior. The app is designed to keep working when you manually provide `top.svg`, `bottom.svg`, and copper-layer SVGs directly.

## 3D Board Models

Use GLB files for the default browser preview because they load much faster than STEP files.

Place model exports here:

```text
content/projects/[slug]/model/
```

Reference them in `project.json`:

```json
"model3d": {
  "title": "Board 3D Model",
  "description": "Interactive 3D board model from Altium exports.",
  "glbFile": "/content/projects/[slug]/model/board.glb",
  "stepFile": "/content/projects/[slug]/model/board.step",
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "position": { "x": 0, "y": 0, "z": 0 },
  "zoom": 1
}
```

The home page and project cards use the GLB preview first. The project model page includes a STEP download link when `stepFile` is present. The viewer also has a debug mode:

```text
http://localhost:3000/?modelDebug=1
```

Use debug mode to rotate, pan, and zoom a model, then copy the generated `model3d` JSON values back into `project.json`.

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

## Known Limitations

- No authentication, database, CMS, or upload flow.
- No raw Altium `.SchDoc` or `.PcbDoc` parsing.
- No automatic net/component cross-probing yet.
- Gerber rendering may need manual SVG fallback for some Altium output sets.
- Project pages are intentionally marked under construction until final assets and descriptions are complete.
