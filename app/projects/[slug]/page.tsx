import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectNavCards } from "@/components/ProjectNavCards";
import { ProjectStats } from "@/components/ProjectStats";
import { FeaturedProjectSection } from "@/components/FeaturedProjectSection";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  return (
    <main>
      <ProjectHeader project={project} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <ProjectNavCards slug={project.slug} />
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded border border-line-soft bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Case Study</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Engineering Summary</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {project.highlights.map((highlight) => (
                  <div key={highlight.label} className="rounded border border-line-soft bg-[#0b1018] px-3 py-2">
                    <p className="text-lg font-semibold text-white">{highlight.value}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">{highlight.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{project.summary}</p>
          </div>
          <div className="rounded border border-line-soft bg-panel p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Design Focus</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {project.mainConstraints.map((constraint) => (
                <li key={constraint} className="border-l border-copper/45 pl-3">
                  {constraint}
                </li>
              ))}
            </ul>
            {project.publicNote ? (
              <p className="mt-4 rounded border border-warning/30 bg-warning/10 p-3 text-xs leading-5 text-warning">
                {project.publicNote}
              </p>
            ) : null}
          </div>
        </section>
        <ProjectStats project={project} />
        {project.featured ? <FeaturedProjectSection features={project.featured} /> : null}
      </div>
    </main>
  );
}
