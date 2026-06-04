import Link from "next/link";
import { ArrowRight, CircuitBoard, Gauge, RadioTower, Zap } from "lucide-react";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { TagPill } from "@/components/TagPill";

const capabilities = [
  { label: "Power Electronics", icon: Zap },
  { label: "Avionics", icon: CircuitBoard },
  { label: "HITL", icon: Gauge },
  { label: "RF / Telemetry", icon: RadioTower },
  { label: "Embedded Hardware", icon: CircuitBoard },
  { label: "Validation", icon: Gauge },
];

export default function HomePage() {
  const projects = getProjects();
  const featured = projects.slice(0, 3);

  return (
    <main>
      <section className="border-b border-line-soft">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <TagPill label="Altium Designer" />
              <TagPill label="Gerber SVG views" />
              <TagPill label="Engineering notes" />
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              PCB design portfolio
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Case studies for board-level electrical design work, built around exported Altium artifacts:
              schematic pages, Gerber-derived layout renders, STEP models, BOMs, and wiki-style design notes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex h-11 items-center gap-2 rounded border border-signal/45 bg-signal/15 px-4 text-sm font-semibold text-white hover:bg-signal/25"
              >
                View projects
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/projects/recovery-system/wiki"
                className="inline-flex h-11 items-center rounded border border-line-soft px-4 text-sm font-semibold text-slate-200 hover:border-signal/35"
              >
                Read sample wiki
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-line-soft bg-panel p-4 shadow-glow">
            <div className="grid grid-cols-2 gap-3">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <div key={capability.label} className="rounded border border-line-soft bg-[#0b1018] p-4">
                    <Icon className="mb-4 size-5 text-signal" aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-100">{capability.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Featured</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">PCB case studies</h2>
          </div>
          <Link href="/projects" className="text-sm font-medium text-signal hover:text-white">
            All projects
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
