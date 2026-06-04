import Image from "next/image";
import type { TestEvidence } from "@/types/project";
import { getAssetUrl } from "@/lib/assets";
import { StatusBadge } from "@/components/StatusBadge";

interface TestEvidenceTableProps {
  tests: TestEvidence[];
}

export function TestEvidenceTable({ tests }: TestEvidenceTableProps) {
  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <article key={test.name} className="rounded-lg border border-line-soft bg-panel p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{test.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{test.purpose}</p>
            </div>
            <StatusBadge status={test.status} />
          </div>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Setup</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-300">{test.setup}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Expected</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-300">{test.expected}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Actual</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-300">{test.actual}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Notes</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-300">{test.notes ?? "No notes yet."}</dd>
            </div>
          </dl>
          {test.evidence.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {test.evidence.map((image) => (
                <div key={image} className="relative aspect-[16/10] overflow-hidden rounded border border-line-soft bg-[#0b1018]">
                  <Image src={getAssetUrl(image)} alt={`${test.name} evidence`} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
