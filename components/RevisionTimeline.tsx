import type { Revision } from "@/types/project";
import { StatusBadge } from "@/components/StatusBadge";

interface RevisionTimelineProps {
  revisions: Revision[];
}

export function RevisionTimeline({ revisions }: RevisionTimelineProps) {
  return (
    <section className="rounded-lg border border-line-soft bg-panel p-5">
      <h2 className="text-lg font-semibold text-white">Revision Timeline</h2>
      <ol className="mt-5 space-y-4">
        {revisions.map((revision) => (
          <li key={revision.rev} className="border-l border-line-soft pl-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-100">{revision.rev}</span>
              <StatusBadge status={revision.status} />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{revision.notes}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
