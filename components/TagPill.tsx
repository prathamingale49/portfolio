interface TagPillProps {
  label: string;
}

export function TagPill({ label }: TagPillProps) {
  return (
    <span className="inline-flex items-center border border-line-soft bg-transparent px-2 py-1 text-xs text-slate-400">
      {label}
    </span>
  );
}
