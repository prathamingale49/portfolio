interface TagPillProps {
  label: string;
}

export function TagPill({ label }: TagPillProps) {
  return (
    <span className="inline-flex items-center rounded border border-line-soft bg-white/[0.03] px-2 py-1 text-xs text-slate-300">
      {label}
    </span>
  );
}
