import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { getAssetUrl } from "@/lib/assets";
import { TestEvidenceTable } from "@/components/TestEvidenceTable";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function TestsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  const gallery = project.tests.flatMap((test) => test.evidence);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-slate-500">Validation</p>
        <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Test evidence</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
          Bring-up cases, expected behavior, actual results, and supporting oscilloscope, thermal, and lab images.
        </p>
      </div>
      <TestEvidenceTable tests={project.tests} />
      {gallery.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">Evidence Gallery</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image) => (
              <div key={image} className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line-soft bg-panel">
                <Image src={getAssetUrl(image)} alt="Project evidence" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
