"use client";

import { Maximize, Minus, Plus, RotateCcw } from "lucide-react";

interface ViewerToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  extra?: React.ReactNode;
}

export function ViewerToolbar({ zoom, onZoomIn, onZoomOut, onReset, extra }: ViewerToolbarProps) {
  return (
    <div className="sticky top-[57px] z-20 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-line-soft bg-panel px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className="grid size-9 place-items-center rounded border border-line-soft bg-[#0b1018] text-slate-200 hover:border-signal/45"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-16 text-center text-xs tabular-nums text-slate-400">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className="grid size-9 place-items-center rounded border border-line-soft bg-[#0b1018] text-slate-200 hover:border-signal/45"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset view"
          title="Reset view"
          className="grid size-9 place-items-center rounded border border-line-soft bg-[#0b1018] text-slate-200 hover:border-signal/45"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
        <Maximize className="ml-1 hidden size-4 text-slate-500 sm:block" aria-hidden="true" />
      </div>
      {extra}
    </div>
  );
}
