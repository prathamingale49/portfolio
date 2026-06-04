import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const contentRoot = path.join(root, "content", "projects");
const generatedRoot = path.join(root, "public", "generated");

function log(slug: string, message: string) {
  console.log(`[render:gerbers] ${slug}: ${message}`);
}

function getManufacturingFiles(gerberDir: string) {
  return fs
    .readdirSync(gerberDir)
    .filter((file) => /\.(gbr|drl|txt)$/i.test(file))
    .map((file) => path.join(gerberDir, file));
}

function findRenderedPair(outputDir: string) {
  const files = fs.readdirSync(outputDir);
  const top = files.find((file) => /\.top\.svg$/i.test(file));
  const bottom = files.find((file) => /\.bottom\.svg$/i.test(file));

  if (!top || !bottom) {
    return null;
  }

  return {
    top: path.join(outputDir, top),
    bottom: path.join(outputDir, bottom),
  };
}

const copperLayerOutputs = [
  {
    source: "PCB0_Copper_Signal_Top.gbr",
    rendered: "PCB0_Copper_Signal_Top.gbr.top.copper.svg",
    output: "copper-top.svg",
    color: "#ff1f1f",
  },
  {
    source: "PCB0_Copper_Signal_1.gbr",
    rendered: "PCB0_Copper_Signal_1.gbr.inner.copper.svg",
    output: "copper-1.svg",
    color: "#c99a00",
  },
  {
    source: "PCB0_Copper_Signal_2.gbr",
    rendered: "PCB0_Copper_Signal_2.gbr.inner.copper.svg",
    output: "copper-2.svg",
    color: "#5fd3ee",
  },
  {
    source: "PCB0_Copper_Signal_3.gbr",
    rendered: "PCB0_Copper_Signal_3.gbr.inner.copper.svg",
    output: "copper-3.svg",
    color: "#17d36b",
  },
  {
    source: "PCB0_Copper_Signal_4.gbr",
    rendered: "PCB0_Copper_Signal_4.gbr.inner.copper.svg",
    output: "copper-4.svg",
    color: "#8b5cf6",
  },
  {
    source: "PCB0_Copper_Signal_Bot.gbr",
    rendered: "PCB0_Copper_Signal_Bot.gbr.bottom.copper.svg",
    output: "copper-bottom.svg",
    color: "#151cff",
  },
];

function colorizeLayerSvg(svg: string, color: string) {
  const withoutRootColor = svg
    .replace(/<svg\s+fill="#[0-9a-fA-F]{3,6}"\s+stroke="#[0-9a-fA-F]{3,6}"\s+/, "<svg ")
    .replace(/<svg\s+/, `<svg color="${color}" fill="${color}" stroke="${color}" `)
    .replace(/currentColor/g, color);

  return withoutRootColor;
}

function renderCopperLayers(slug: string, gerberDir: string, outputDir: string) {
  const copperFiles = copperLayerOutputs
    .map((layer) => path.join(gerberDir, layer.source))
    .filter((file) => fs.existsSync(file));

  if (copperFiles.length === 0) {
    return;
  }

  log(slug, `rendering ${copperFiles.length} individual copper layer SVGs.`);
  const result = spawnSync(
    "npx",
    ["tracespace", "-B", "--out", outputDir, ...copperFiles],
    {
      cwd: root,
      encoding: "utf8",
      shell: true,
    },
  );

  if (result.stdout.trim()) {
    console.log(result.stdout.trim());
  }

  if (result.stderr.trim()) {
    console.error(result.stderr.trim());
  }

  if (result.status !== 0) {
    log(slug, "individual copper layer render failed.");
    return;
  }

  for (const layer of copperLayerOutputs) {
    const renderedPath = path.join(outputDir, layer.rendered);
    if (fs.existsSync(renderedPath)) {
      const svg = fs.readFileSync(renderedPath, "utf8");
      fs.writeFileSync(path.join(outputDir, layer.output), colorizeLayerSvg(svg, layer.color));
    }
  }
}

function main() {
  if (!fs.existsSync(contentRoot)) {
    console.log("[render:gerbers] No content/projects directory found.");
    return;
  }

  const projectSlugs = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const slug of projectSlugs) {
    const layoutDir = path.join(contentRoot, slug, "layout");
    const gerberDir = path.join(layoutDir, "gerbers");
    const gerberZip = path.join(layoutDir, "gerbers.zip");
    const outputDir = path.join(generatedRoot, slug, "layout");
    const topFallback = path.join(outputDir, "top.svg");
    const bottomFallback = path.join(outputDir, "bottom.svg");

    if (!fs.existsSync(gerberDir)) {
      if (fs.existsSync(gerberZip)) {
        log(slug, "found gerbers.zip but no extracted gerbers directory; extract the ZIP or provide manual SVGs.");
      } else {
        log(slug, "missing layout/gerbers.zip and layout/gerbers; using manual SVG fallback if present.");
      }

      if (fs.existsSync(topFallback) && fs.existsSync(bottomFallback)) {
        log(slug, "manual top.svg and bottom.svg already exist.");
      }
      continue;
    }

    const files = getManufacturingFiles(gerberDir);
    if (files.length === 0) {
      log(slug, "layout/gerbers contains no .gbr/.drl/.txt files; use manual SVG fallback.");
      continue;
    }

    fs.mkdirSync(outputDir, { recursive: true });
    log(slug, `rendering ${files.length} Gerber/drill files with tracespace.`);

    const result = spawnSync(
      "npx",
      ["tracespace", "-L", "--out", outputDir, ...files],
      {
        cwd: root,
        encoding: "utf8",
        shell: true,
      },
    );

    if (result.stdout.trim()) {
      console.log(result.stdout.trim());
    }

    if (result.stderr.trim()) {
      console.error(result.stderr.trim());
    }

    if (result.status !== 0) {
      log(slug, "render failed; use manual SVG fallback in public/generated/[slug]/layout/top.svg and bottom.svg.");
      continue;
    }

    const rendered = findRenderedPair(outputDir);
    if (!rendered) {
      log(slug, "render completed but top/bottom composite SVGs were not found.");
      continue;
    }

    fs.copyFileSync(rendered.top, topFallback);
    fs.copyFileSync(rendered.bottom, bottomFallback);
    log(slug, "render succeeded; wrote top.svg and bottom.svg.");
    renderCopperLayers(slug, gerberDir, outputDir);
  }
}

main();
