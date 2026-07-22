import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, Cpu } from "lucide-react";
import type { Project } from "@/types/project";
import { TagPill } from "@/components/TagPill";
import { BoardModelViewer } from "@/components/viewers/BoardModelViewer";

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  simple?: boolean;
}

export function ProjectCard({ project, compact = false, simple = false }: ProjectCardProps) {
  const layerLabel = project.layerCount > 0 ? `${project.layerCount} layers` : "TBD";
  const previewHeight = compact
    ? "h-44"
    : simple
      ? "h-full min-h-[9rem] sm:min-h-[10rem]"
      : "h-full min-h-[12.5rem] sm:min-h-[14rem] lg:min-h-[16rem]";

  return (
    <article
      className={
        compact
          ? "group overflow-hidden rounded border border-line-soft bg-panel transition hover:border-signal/45"
          : simple
            ? "group grid grid-cols-[minmax(10.5rem,0.28fr)_minmax(0,1fr)] overflow-hidden rounded border border-line-soft bg-panel transition hover:border-signal/45 sm:grid-cols-[minmax(14rem,0.3fr)_minmax(0,1fr)]"
            : "group grid grid-cols-[minmax(9rem,0.3fr)_minmax(0,1fr)] overflow-hidden rounded border border-line-soft bg-panel transition hover:border-signal/45 sm:grid-cols-[minmax(13rem,0.34fr)_minmax(0,1fr)] lg:grid-cols-[minmax(18rem,0.38fr)_minmax(0,1fr)]"
      }
    >
      <div
        className={
          simple
            ? "relative m-3 h-28 overflow-hidden rounded border border-line-soft bg-[#0a1018] sm:h-32"
            : `relative bg-[#0a1018] ${compact ? "border-b border-line-soft" : "border-r border-line-soft"} ${previewHeight}`
        }
      >
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
            className="h-full"
            viewerClassName="h-full"
          />
        ) : (
          <Image
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            className="object-cover"
            sizes={compact ? "(max-width: 768px) 100vw, 320px" : simple ? "224px" : "(max-width: 768px) 100vw, 440px"}
          />
        )}
      </div>

      <div className={compact ? "relative z-10 space-y-3 p-4" : simple ? "relative z-10 space-y-3 p-4" : "relative z-10 space-y-3 p-4 sm:space-y-4 sm:p-5 lg:p-6"}>
        <div>
          <div>
            {simple ? (
              <h3 className="text-lg font-semibold text-slate-50 sm:text-xl">{project.title}</h3>
            ) : (
              <Link
                href={`/projects/${project.slug}`}
                className={compact ? "block text-base font-semibold text-slate-50 hover:text-signal" : "block text-lg font-semibold text-slate-50 hover:text-signal sm:text-xl"}
              >
                {project.title}
              </Link>
            )}
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{project.subtitle}</p>
            {!compact ? (
              <p className={simple ? "mt-3 max-w-4xl text-sm leading-6 text-slate-300" : "mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-300 lg:line-clamp-3"}>
                {project.summary}
              </p>
            ) : null}
          </div>
        </div>

        {simple ? null : (
          <dl className={compact ? "grid grid-cols-2 gap-3 text-sm" : "grid grid-cols-2 gap-3 text-sm xl:grid-cols-4"}>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="mt-1 line-clamp-2 text-slate-300">{project.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Board</dt>
              <dd className="mt-1 text-slate-300">{layerLabel}</dd>
            </div>
            {!compact ? (
              <div className="xl:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Tools</dt>
                <dd className="mt-1 text-slate-300">{project.tools.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
        )}

        {!compact && !simple ? (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 7).map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-line-soft pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-8 items-center gap-1.5 rounded border border-line-soft px-2.5 text-xs font-medium text-slate-200 hover:border-signal/45"
          >
            Case study
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link
            href={`/projects/${project.slug}/layout`}
            className="inline-flex h-8 items-center gap-1.5 rounded border border-line-soft px-2.5 text-xs font-medium text-slate-200 hover:border-copper/45"
          >
            <Cpu className="size-3.5" aria-hidden="true" />
            Layout
          </Link>
          {project.model3d ? (
            <Link
              href={`/projects/${project.slug}/model`}
              className="inline-flex h-8 items-center gap-1.5 rounded border border-line-soft px-2.5 text-xs font-medium text-slate-200 hover:border-solder/45"
            >
              <Box className="size-3.5" aria-hidden="true" />
              3D
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
