"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { projectCategories, projectStatuses, type Project } from "@/types/project";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = category === "All" || project.category.includes(category as never);
      const matchesStatus = status === "All" || project.status === status;
      return matchesCategory && matchesStatus;
    });
  }, [category, projects, status]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-lg border border-line-soft bg-panel p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <SlidersHorizontal className="size-4 text-signal" aria-hidden="true" />
          Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs uppercase tracking-wide text-slate-500">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 rounded border border-line-soft bg-[#0b1018] px-3 text-sm normal-case tracking-normal text-slate-100"
            >
              <option>All</option>
              {projectCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs uppercase tracking-wide text-slate-500">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded border border-line-soft bg-[#0b1018] px-3 text-sm normal-case tracking-normal text-slate-100"
            >
              <option>All</option>
              {projectStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
