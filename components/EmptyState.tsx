import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="grid min-h-[18rem] place-items-center rounded border border-dashed border-line-soft bg-panel/70 p-8 text-center">
      <div>
        <AlertCircle className="mx-auto mb-4 size-8 text-warning" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{message}</p>
      </div>
    </div>
  );
}
