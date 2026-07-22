import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { Project, TocItem } from "@/types/project";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

const projectOrder = [
  "recovery-system",
  "rf-link-evaluation-board",
  "vespula-avionics-module",
  "darcy-battery-management-system",
  "flight-computer",
  "darcy-umbilical",
  "hardware-in-the-loop",
];

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(projectsDirectory, slug, "project.json")))
    .sort((a, b) => {
      const aIndex = projectOrder.indexOf(a);
      const bIndex = projectOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });
}

export function getProject(slug: string): Project {
  const projectPath = path.join(projectsDirectory, slug, "project.json");
  const raw = fs.readFileSync(projectPath, "utf8");
  const parsed = JSON.parse(raw) as Project;

  if (parsed.slug !== slug) {
    throw new Error(`Project slug mismatch: expected ${slug}, got ${parsed.slug}`);
  }

  return parsed;
}

export function getProjects(): Project[] {
  return getProjectSlugs().map(getProject);
}

export function getWikiSource(slug: string): string {
  const wikiPath = path.join(projectsDirectory, slug, "wiki.mdx");
  if (!fs.existsSync(wikiPath)) {
    return "# Wiki\n\nNo wiki.mdx file has been added for this project yet.";
  }

  return fs.readFileSync(wikiPath, "utf8");
}

export function getWikiToc(markdown: string): TocItem[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => /^(#{2,3})\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => {
      const title = match[2].trim();
      return {
        title,
        depth: match[1].length,
        id: slugifyHeading(title),
      };
    });
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
