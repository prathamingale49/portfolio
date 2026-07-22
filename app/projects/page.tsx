import { getProjects } from "@/lib/projects";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-slate-500">Portfolio</p>
          <h1 className="mt-1 text-3xl font-semibold text-white md:text-4xl">PCB projects</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Static Altium exports, compact board viewers, and engineering notes for each case study.
          </p>
        </div>
        <p className="rounded border border-line-soft bg-panel px-3 py-2 text-sm text-slate-300">
          {projects.length} projects
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </main>
  );
}
