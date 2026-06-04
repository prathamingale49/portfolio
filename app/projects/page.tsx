import { getProjects } from "@/lib/projects";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-slate-500">Portfolio</p>
        <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">PCB projects</h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Filter board projects by application domain and development status. Each case study is backed by
          static Altium exports and engineering notes.
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </main>
  );
}
