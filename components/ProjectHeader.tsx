import type { Project } from "@/types/project";
import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="border-b border-line-soft bg-panel/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="text-sm text-slate-400">{project.dateRange}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">{project.subtitle}</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">{project.role}</p>
          </div>
          <div className="flex max-w-xl flex-wrap gap-2">
            {project.category.map((category) => (
              <TagPill key={category} label={category} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
