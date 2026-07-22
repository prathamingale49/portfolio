import type { Project } from "@/types/project";
import { TagPill } from "@/components/TagPill";
import { BoardModelViewer } from "@/components/viewers/BoardModelViewer";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="border-b border-line-soft bg-[#0d121a]/80">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.56fr)] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded border border-amber-400/35 bg-amber-400/10 px-2 py-1 text-xs font-medium uppercase tracking-[0.14em] text-amber-200">
                Under construction
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{project.subtitle}</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{project.role}</p>
            <div className="mt-5 flex max-w-xl flex-wrap gap-2">
              {project.category.map((category) => (
                <TagPill key={category} label={category} />
              ))}
            </div>
          </div>
          {project.model3d ? (
            <BoardModelViewer
              chrome={false}
              compact
              title={project.model3d.title}
              glbFile={project.model3d.glbFile}
              stepFile={project.model3d.stepFile}
              rotation={project.model3d.rotation}
              position={project.model3d.position}
              zoom={project.model3d.zoom}
              camera={project.model3d.camera}
              className="overflow-hidden rounded border border-line-soft bg-[#0a1018]"
              viewerClassName="h-[16rem]"
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
