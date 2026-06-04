import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { StatusBadge } from "@/components/StatusBadge";
import { TagPill } from "@/components/TagPill";
import { BoardModelViewer } from "@/components/viewers/BoardModelViewer";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const layerLabel = project.layerCount > 0 ? `${project.layerCount} layers` : "TBD";

  return (
    <article className="group overflow-hidden rounded-lg border border-line-soft bg-panel shadow-glow transition hover:border-signal/45">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/9] border-b border-line-soft bg-[#0d121a]">
          {project.model3d ? (
            <BoardModelViewer
              chrome={false}
              compact
              title={project.model3d.title}
              stepFile={project.model3d.stepFile}
              className="h-full"
              viewerClassName="h-full"
            />
          ) : (
            <Image
              src={project.thumbnail}
              alt={`${project.title} thumbnail`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          )}
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 group-hover:text-signal">
                {project.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">{project.subtitle}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="mt-1 line-clamp-2 text-slate-300">{project.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Board</dt>
              <dd className="mt-1 text-slate-300">{layerLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Tools</dt>
              <dd className="mt-1 text-slate-300">{project.tools.slice(0, 2).join(", ")}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Date</dt>
              <dd className="mt-1 text-slate-300">{project.dateRange}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 5).map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
