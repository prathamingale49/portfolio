import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const contentRoot = path.join(root, "content", "projects");
const generatedRoot = path.join(root, "public", "generated");

function log(slug: string, message: string) {
  console.log(`[render:gerbers] ${slug}: ${message}`);
}

function commandExists(command: string) {
  const result = spawnSync(command, ["--version"], {
    shell: true,
    stdio: "ignore",
  });
  return result.status === 0;
}

function main() {
  if (!fs.existsSync(contentRoot)) {
    console.log("[render:gerbers] No content/projects directory found.");
    return;
  }

  const hasTracespace = commandExists("tracespace");
  const projectSlugs = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const slug of projectSlugs) {
    const gerberZip = path.join(contentRoot, slug, "layout", "gerbers.zip");
    const outputDir = path.join(generatedRoot, slug, "layout");
    const topFallback = path.join(outputDir, "top.svg");
    const bottomFallback = path.join(outputDir, "bottom.svg");

    if (!fs.existsSync(gerberZip)) {
      log(slug, "missing layout/gerbers.zip; using manual SVG fallback if present.");
      if (fs.existsSync(topFallback) && fs.existsSync(bottomFallback)) {
        log(slug, "manual top.svg and bottom.svg already exist.");
      }
      continue;
    }

    if (!hasTracespace) {
      log(slug, "tracespace CLI not found; install @tracespace/cli or provide manual top.svg and bottom.svg.");
      continue;
    }

    fs.mkdirSync(outputDir, { recursive: true });

    log(slug, "gerbers.zip found. Tracespace ZIP rendering is project/package-version dependent.");
    log(slug, "TODO: extract ZIP, identify copper/soldermask/silkscreen/drill files, then call tracespace for top and bottom board renders.");
    log(slug, "render failed; use manual SVG fallback in public/generated/[slug]/layout/top.svg and bottom.svg.");
  }
}

main();
