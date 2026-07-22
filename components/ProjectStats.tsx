import type { Project } from "@/types/project";

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const stats = [
    { label: "Layers", value: project.layerCount > 0 ? `${project.layerCount}` : "TBD" },
    { label: "Stackup", value: project.stackup },
    { label: "Board Size", value: project.boardSize ?? "TBD" },
    { label: "Tools", value: project.tools.join(", ") },
    { label: "Key Parts", value: project.keyComponents.join(", ") },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded border border-line-soft bg-panel p-4 ${
            stat.label === "Tools" || stat.label === "Key Parts" ? "xl:col-span-2" : ""
          }`}
        >
          <dt className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</dt>
          <dd className={`mt-2 text-sm leading-6 text-slate-200 ${stat.label === "Tools" ? "" : "line-clamp-3"}`}>
            {stat.value}
          </dd>
        </div>
      ))}
    </section>
  );
}
