import Link from "next/link";
import type { LayoutCallout, SchematicHotspot, SchematicPage } from "@/types/project";

interface CalloutPanelProps {
  title: string;
  description: string;
  selected?: LayoutCallout | SchematicHotspot;
  page?: SchematicPage;
  slug: string;
}

export function CalloutPanel({ title, description, selected, page, slug }: CalloutPanelProps) {
  const wikiTarget =
    selected && "wikiSection" in selected
      ? selected.wikiSection
      : selected && "type" in selected && selected.type === "wiki"
        ? selected.target
        : undefined;

  return (
    <aside className="h-full border-l border-line-soft bg-panel p-5">
      <div className="space-y-5">
        <div>
          <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        {page ? (
          <div className="rounded border border-line-soft bg-[#0b1018] p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Page</p>
            <p className="mt-1 text-sm text-slate-200">{page.title}</p>
          </div>
        ) : null}
        {selected ? (
          <div className="rounded border border-signal/30 bg-signal/10 p-4">
            <p className="text-xs uppercase tracking-wide text-signal">Selected</p>
            <h3 className="mt-2 text-base font-semibold text-white">{selected.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{selected.description}</p>
            {wikiTarget ? (
              <Link
                href={`/projects/${slug}/wiki#${wikiTarget}`}
                className="mt-4 inline-flex text-sm font-medium text-signal hover:text-white"
              >
                Open wiki section
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="rounded border border-line-soft bg-[#0b1018] p-4 text-sm leading-6 text-slate-400">
            Select a highlighted region to inspect the design note.
          </p>
        )}
      </div>
    </aside>
  );
}
