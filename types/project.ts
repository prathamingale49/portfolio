export const projectCategories = [
  "Avionics",
  "Power Electronics",
  "RF / Telemetry",
  "Embedded Systems",
  "Test / HITL",
  "High Current",
] as const;

export const projectStatuses = [
  "Designed",
  "Fabricated",
  "Assembled",
  "Validated",
  "Archived",
] as const;

export const testStatuses = ["Pass", "Fail", "Partial", "Not Tested"] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type TestStatus = (typeof testStatuses)[number];

export type HotspotType = "page" | "wiki" | "note";

export interface Highlight {
  label: string;
  value: string;
}

export interface SchematicHotspot {
  id: string;
  label: string;
  type: HotspotType;
  target?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface SchematicPage {
  id: string;
  title: string;
  file: string;
  description: string;
  hotspots: SchematicHotspot[];
}

export interface LayoutView {
  id: string;
  title: string;
  file: string;
  color?: string;
}

export interface ProjectModel3D {
  stepFile?: string;
  title: string;
  description: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  image: string;
  tag?: string;
}

export interface LayoutCallout {
  id: string;
  label: string;
  view: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  wikiSection?: string;
}

export interface TestEvidence {
  name: string;
  purpose: string;
  setup: string;
  expected: string;
  actual: string;
  status: TestStatus;
  evidence: string[];
  notes?: string;
}

export interface Revision {
  rev: string;
  status: ProjectStatus;
  notes: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory[];
  status: ProjectStatus;
  role: string;
  dateRange: string;
  tools: string[];
  layerCount: number;
  stackup: string;
  boardSize?: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  highlights: Highlight[];
  keyComponents: string[];
  mainConstraints: string[];
  publicNote?: string;
  model3d?: ProjectModel3D;
  featured?: ProjectFeature[];
  schematic: {
    pages: SchematicPage[];
  };
  layout: {
    views: LayoutView[];
    callouts: LayoutCallout[];
  };
  tests: TestEvidence[];
  revisions: Revision[];
}

export interface TocItem {
  id: string;
  title: string;
  depth: number;
}
