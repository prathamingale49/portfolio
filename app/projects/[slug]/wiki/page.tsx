import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs, getWikiSource, getWikiToc } from "@/lib/projects";
import { MDXContent } from "@/components/MDXContent";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  const source = getWikiSource(project.slug);
  const toc = getWikiToc(source);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <div className="rounded-lg border border-line-soft bg-panel p-4">
          <Link href={`/projects/${project.slug}`} className="text-sm text-signal hover:text-white">
            Back to overview
          </Link>
          <p className="mt-5 text-xs uppercase tracking-wide text-slate-500">Contents</p>
          <nav className="mt-3 grid gap-2 text-sm">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-slate-300 hover:text-white ${item.depth === 3 ? "pl-3 text-xs" : ""}`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:text-white prose-a:text-signal prose-strong:text-slate-100 prose-img:rounded-lg prose-img:border prose-img:border-line-soft">
        <h1>{project.title} Wiki</h1>
        <div className="not-prose mb-6 rounded border border-amber-400/35 bg-amber-400/10 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-200">Under construction</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            These notes are being tightened as final screenshots, measurements, and layout callouts are added.
          </p>
        </div>
        <MDXContent source={source} />
      </article>
    </main>
  );
}
