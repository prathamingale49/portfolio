import type { ProjectStatus, TestStatus } from "@/types/project";

const projectStyles: Record<ProjectStatus, string> = {
  Designed: "border-signal/40 bg-signal/10 text-signal",
  Fabricated: "border-warning/40 bg-warning/10 text-warning",
  Assembled: "border-copper/45 bg-copper/10 text-copper",
  Validated: "border-solder/45 bg-solder/10 text-solder",
  Archived: "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

const testStyles: Record<TestStatus, string> = {
  Pass: "border-solder/45 bg-solder/10 text-solder",
  Fail: "border-red-400/45 bg-red-400/10 text-red-300",
  Partial: "border-warning/40 bg-warning/10 text-warning",
  "Not Tested": "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

interface StatusBadgeProps {
  status: ProjectStatus | TestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    status in projectStyles
      ? projectStyles[status as ProjectStatus]
      : testStyles[status as TestStatus];

  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
