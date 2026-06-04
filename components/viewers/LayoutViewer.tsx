"use client";

import { useMemo, useRef, useState } from "react";
import type { LayoutCallout, LayoutView } from "@/types/project";
import { getAssetUrl } from "@/lib/assets";
import { EmptyState } from "@/components/EmptyState";
import { CalloutPanel } from "@/components/viewers/CalloutPanel";
import { HotspotOverlay } from "@/components/viewers/HotspotOverlay";
import { ViewerToolbar } from "@/components/viewers/ViewerToolbar";

interface LayoutViewerProps {
  slug: string;
  views: LayoutView[];
  callouts: LayoutCallout[];
}

interface Pan {
  x: number;
  y: number;
}

export function LayoutViewer({ slug, views, callouts }: LayoutViewerProps) {
  const [selectedViewId, setSelectedViewId] = useState(views[0]?.id ?? "");
  const [selectedCallout, setSelectedCallout] = useState<LayoutCallout | undefined>();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [missingAsset, setMissingAsset] = useState(false);
  const dragStart = useRef<{ pointerId: number; x: number; y: number; pan: Pan } | null>(null);

  const selectedView = useMemo(
    () => views.find((view) => view.id === selectedViewId) ?? views[0],
    [selectedViewId, views],
  );

  const activeCallouts = useMemo(
    () => callouts.filter((callout) => callout.view === selectedView?.id),
    [callouts, selectedView?.id],
  );

  if (!selectedView) {
    return (
      <EmptyState
        title="No layout views"
        message="Add top.svg and bottom.svg under public/generated/[slug]/layout or list your own generated board views in project.json."
      />
    );
  }

  function selectView(viewId: string) {
    setSelectedViewId(viewId);
    setSelectedCallout(undefined);
    setMissingAsset(false);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }

  const toolbarExtra = (
    <div className="flex flex-wrap items-center gap-2">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => selectView(view.id)}
          className={`h-9 rounded border px-3 text-sm ${
            selectedView.id === view.id
              ? "border-copper/50 bg-copper/15 text-white"
              : "border-line-soft bg-[#0b1018] text-slate-300 hover:border-copper/40"
          }`}
        >
          {view.title}
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid min-h-[calc(100vh-57px)] grid-cols-1 border-y border-line-soft lg:grid-cols-[minmax(0,1fr)_22rem]">
      <main className="min-w-0 bg-[#080b10]">
        <ViewerToolbar
          zoom={zoom}
          onZoomIn={() => setZoom((value) => Math.min(value + 0.15, 2.8))}
          onZoomOut={() => setZoom((value) => Math.max(value - 0.15, 0.45))}
          onReset={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          extra={toolbarExtra}
        />
        <div
          className="viewer-scrollbar schematic-grid h-[calc(100vh-113px)] cursor-grab overflow-hidden active:cursor-grabbing"
          onPointerDown={(event) => {
            dragStart.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              pan,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragStart.current) return;
            const dx = event.clientX - dragStart.current.x;
            const dy = event.clientY - dragStart.current.y;
            setPan({ x: dragStart.current.pan.x + dx, y: dragStart.current.pan.y + dy });
          }}
          onPointerUp={() => {
            dragStart.current = null;
          }}
        >
          <div
            className="relative mx-auto my-8 aspect-[16/10] w-[96%] min-w-[760px] max-w-6xl origin-center rounded border border-line-soft bg-[#07110f] shadow-glow"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            {missingAsset ? (
              <div className="grid h-full place-items-center p-8">
                <EmptyState
                  title="No rendered PCB view found"
                  message="Add top.svg and bottom.svg, or run the Gerber render pipeline. Manual fallback files belong in public/generated/[slug]/layout."
                />
              </div>
            ) : (
              <img
                src={getAssetUrl(selectedView.file)}
                alt={selectedView.title}
                className="h-full w-full object-contain"
                draggable={false}
                onError={() => setMissingAsset(true)}
              />
            )}
            <HotspotOverlay
              items={activeCallouts}
              activeId={selectedCallout?.id}
              onSelect={setSelectedCallout}
              tone="copper"
            />
          </div>
        </div>
      </main>
      <CalloutPanel
        slug={slug}
        title={selectedView.title}
        description="Gerber-derived or manually supplied board render with percentage-based layout callouts."
        selected={selectedCallout}
      />
    </div>
  );
}
