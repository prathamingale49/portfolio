import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { SchematicViewer } from "@/components/viewers/SchematicViewer";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function SchematicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }

  return <SchematicViewer slug={project.slug} pages={project.schematic.pages} />;
}
