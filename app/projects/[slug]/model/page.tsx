import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { getAssetUrl } from "@/lib/assets";
import { BoardModelViewer } from "@/components/viewers/BoardModelViewer";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  const model = project.model3d;

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {project.title}
        </Link>
        {model?.stepFile ? (
          <a
            href={getAssetUrl(model.stepFile)}
            download
            className="inline-flex w-fit items-center gap-2 rounded border border-line-soft px-3 py-2 text-sm font-medium text-slate-200 hover:border-copper/60"
          >
            <Download className="size-4" aria-hidden="true" />
            Download STEP source
          </a>
        ) : null}
        <BoardModelViewer
          title={model?.title ?? "3D Board Model"}
          description={model?.description ?? "A public 3D board model is not available for this project yet."}
          glbFile={model?.glbFile}
          stepFile={model?.stepFile}
          rotation={model?.rotation}
          position={model?.position}
          zoom={model?.zoom}
          camera={model?.camera}
        />
      </div>
    </main>
  );
}
