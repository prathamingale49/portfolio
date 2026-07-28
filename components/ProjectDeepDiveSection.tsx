import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import type { ProjectDeepDive } from "@/types/project";

interface ProjectDeepDiveSectionProps {
  projectSlug: string;
  deepDives: ProjectDeepDive[];
}

export function ProjectDeepDiveSection({ projectSlug, deepDives }: ProjectDeepDiveSectionProps) {
  if (deepDives.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Explore the Design</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Engineering deep dives</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {deepDives.map((deepDive) => (
          <Link
            key={deepDive.slug}
            href={`/projects/${projectSlug}/deep-dives/${deepDive.slug}`}
            className="group overflow-hidden rounded border border-line-soft bg-panel transition hover:border-copper/65 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-copper/70"
          >
            <article>
              <div className="aspect-[16/10] border-b border-line-soft bg-[#0b1018]">
                <img
                  src={getAssetUrl(deepDive.image)}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                />
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {deepDive.tag ? (
                    <p className="text-xs uppercase tracking-wide text-copper">{deepDive.tag}</p>
                  ) : null}
                  {deepDive.metric ? (
                    <span className="rounded border border-signal/35 bg-signal/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      {deepDive.metric}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{deepDive.title}</h3>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-copper" />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{deepDive.description}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-signal transition group-hover:text-white">
                  Read deep dive
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
