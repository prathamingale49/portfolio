import type { Project } from "@/types/project";

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const stats = [
    { label: "Layers", value: `${project.layerCount}` },
    { label: "Stackup", value: project.stackup },
    { label: "Board Size", value: project.boardSize ?? "TBD" },
    { label: "Tools", value: project.tools.join(", ") },
    { label: "Key ICs", value: project.keyComponents.join(", ") },
    { label: "Constraints", value: project.mainConstraints.join(", ") },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-line-soft bg-panel p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-200">{stat.value}</dd>
        </div>
      ))}
    </section>
  );
}
