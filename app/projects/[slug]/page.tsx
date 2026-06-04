import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { ProjectHeader } from "@/components/ProjectHeader";
import { ProjectNavCards } from "@/components/ProjectNavCards";
import { ProjectStats } from "@/components/ProjectStats";
import { RevisionTimeline } from "@/components/RevisionTimeline";

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
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <ProjectStats project={project} />
        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-lg border border-line-soft bg-panel p-6">
            <h2 className="text-xl font-semibold text-white">Summary</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{project.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {project.highlights.map((highlight) => (
                <div key={highlight.label} className="rounded border border-line-soft bg-[#0b1018] p-4">
                  <p className="text-2xl font-semibold text-white">{highlight.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{highlight.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line-soft bg-panel p-6">
            <h2 className="text-xl font-semibold text-white">Engineering Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {project.mainConstraints.map((constraint) => (
                <li key={constraint} className="border-l border-signal/35 pl-3">
                  {constraint}
                </li>
              ))}
            </ul>
            {project.publicNote ? (
              <p className="mt-5 rounded border border-warning/30 bg-warning/10 p-3 text-sm leading-6 text-warning">
                {project.publicNote}
              </p>
            ) : null}
          </div>
        </section>
        <ProjectNavCards slug={project.slug} />
        <RevisionTimeline revisions={project.revisions} />
      </div>
    </main>
  );
}
