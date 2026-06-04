import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { LayoutViewer } from "@/components/viewers/LayoutViewer";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function LayoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  return <LayoutViewer slug={project.slug} views={project.layout.views} callouts={project.layout.callouts} />;
}
