import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDeepDiveSource,
  getDeepDiveStaticParams,
  getMarkdownToc,
  getProject,
  getProjectDeepDive,
} from "@/lib/projects";
import { getAssetUrl } from "@/lib/assets";
import { MDXContent } from "@/components/MDXContent";

export function generateStaticParams() {
  return getDeepDiveStaticParams();
}

export default async function DeepDivePage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article } = await params;
  let project;
  let deepDive;

  try {
    project = getProject(slug);
    deepDive = getProjectDeepDive(slug, article);
  } catch {
    notFound();
  }

  const source = getDeepDiveSource(project.slug, deepDive.slug);
  const toc = getMarkdownToc(source);

  return (
    <main>
      <section className="border-b border-line-soft bg-panel-soft">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
          <div>
            <Link href={`/projects/${project.slug}`} className="text-sm text-signal hover:text-white">
              Back to {project.title}
            </Link>
            <p className="mt-6 text-xs uppercase tracking-wide text-copper">{deepDive.tag ?? "Engineering Deep Dive"}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              {deepDive.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{deepDive.description}</p>
            {deepDive.metric ? (
              <p className="mt-5 inline-flex rounded border border-signal/35 bg-signal/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                {deepDive.metric}
              </p>
            ) : null}
          </div>
          <div className="overflow-hidden rounded border border-line-soft bg-[#0b1018]">
            <img src={getAssetUrl(deepDive.image)} alt="" className="h-full min-h-56 w-full object-cover" />
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="rounded border border-line-soft bg-panel p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Contents</p>
            <nav className="mt-3 grid gap-2 text-sm">
              {toc.length > 0 ? (
                toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-slate-300 hover:text-white ${item.depth === 3 ? "pl-3 text-xs" : ""}`}
                  >
                    {item.title}
                  </a>
                ))
              ) : (
                <span className="text-sm text-slate-500">Add headings to build this list.</span>
              )}
            </nav>
          </div>
        </aside>
        <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:text-white prose-a:text-signal prose-strong:text-slate-100 prose-img:rounded prose-img:border prose-img:border-line-soft">
          <MDXContent source={source} />
        </article>
      </div>
    </main>
  );
}
