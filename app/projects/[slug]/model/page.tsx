import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, getProjectSlugs } from "@/lib/projects";
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
        <BoardModelViewer
          title={model?.title ?? "3D Board Model"}
          description={model?.description ?? "Add an Altium STEP export to show the board model."}
          stepFile={model?.stepFile}
        />
      </div>
    </main>
  );
}
