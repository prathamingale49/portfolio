"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Eye, EyeOff, Layers3, Maximize, Minus, Plus, RotateCcw } from "lucide-react";
import type { LayoutCallout, LayoutView } from "@/types/project";
import { getAssetUrl } from "@/lib/assets";
import { EmptyState } from "@/components/EmptyState";
import { HotspotOverlay } from "@/components/viewers/HotspotOverlay";

interface LayoutViewerProps {
  slug: string;
  views: LayoutView[];
  callouts: LayoutCallout[];
}

interface Pan {
  x: number;
  y: number;
}

const BOARD_COPPER_COLOR = "#c89b3c";

function shortLayerTitle(title: string) {
  const match = /^(\d+)\s+(.+)$/.exec(title);
  return match?.[2] ?? title;
}

function layerNumber(title: string, index: number) {
  return /^(\d+)/.exec(title)?.[1] ?? String(index + 1);
}

function layerColor(view: LayoutView) {
  return view.color ?? BOARD_COPPER_COLOR;
}

export function LayoutViewer({ slug, views, callouts }: LayoutViewerProps) {
  const [enabledIds, setEnabledIds] = useState<Set<string>>(
    () => new Set(views[0] ? [views[0].id] : []),
  );
  const [focusedLayerId, setFocusedLayerId] = useState(views[0]?.id ?? "");
  const [selectedCallout, setSelectedCallout] = useState<LayoutCallout | undefined>();
  const [missingAssetIds, setMissingAssetIds] = useState<Set<string>>(() => new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const dragStart = useRef<{ pointerId: number; x: number; y: number; pan: Pan } | null>(null);

  const enabledViews = useMemo(
    () => views.filter((view) => enabledIds.has(view.id) && !missingAssetIds.has(view.id)),
    [enabledIds, missingAssetIds, views],
  );

  const focusedLayer = views.find((view) => view.id === focusedLayerId) ?? views[0];
  const activeCallouts = useMemo(
    () => callouts.filter((callout) => enabledIds.has(callout.view)),
    [callouts, enabledIds],
  );

  if (!views.length) {
    return (
      <EmptyState
        title="No layout views"
        message="Add generated copper SVGs under public/generated/[slug]/layout or list your own board exports in project.json."
      />
    );
  }

  function toggleLayer(viewId: string) {
    setEnabledIds((current) => {
      const next = new Set(current);
      if (next.has(viewId)) {
        next.delete(viewId);
      } else {
        next.add(viewId);
      }
      return next;
    });
    setFocusedLayerId(viewId);
    setSelectedCallout(undefined);
  }

  function soloLayer(viewId: string) {
    setEnabledIds(new Set([viewId]));
    setFocusedLayerId(viewId);
    setSelectedCallout(undefined);
  }

  function showAllLayers() {
    setEnabledIds(new Set(views.map((view) => view.id)));
    setSelectedCallout(undefined);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  const activeLayerLabel =
    enabledViews.length === 0
      ? "No layers enabled"
      : enabledViews.length === 1
        ? enabledViews[0].title
        : `${enabledViews.length} layers visible`;

  return (
    <main className="grid min-h-[calc(100vh-57px)] grid-cols-1 bg-[#090d13] md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-line-soft bg-[#0d121a] md:border-b-0 md:border-r">
        <div className="sticky top-[57px] space-y-5 p-4">
          <div>
            <Link href={`/projects/${slug}`} className="text-xs font-medium text-slate-500 hover:text-slate-200">
              Project overview
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <Layers3 className="size-4 text-copper" aria-hidden="true" />
              <h1 className="text-sm font-semibold text-white">Copper Stack</h1>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Toggle exported Gerber SVG layers. Drag the board to pan.
            </p>
          </div>

          <div className="space-y-1.5">
            {views.map((view, index) => {
              const enabled = enabledIds.has(view.id);
              const missing = missingAssetIds.has(view.id);
              const color = layerColor(view);

              return (
                <div
                  key={view.id}
                  className={`grid grid-cols-[2rem_1.25rem_minmax(0,1fr)_2rem] items-center gap-2 rounded px-2 py-2 text-sm ${
                    focusedLayer?.id === view.id ? "bg-white/[0.06] text-white" : "text-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleLayer(view.id)}
                    className={`grid size-7 place-items-center rounded border ${
                      enabled
                        ? "border-signal/60 bg-signal/20 text-white"
                        : "border-line-soft bg-[#141922] text-slate-500"
                    }`}
                    aria-label={`${enabled ? "Hide" : "Show"} ${view.title}`}
                    title={`${enabled ? "Hide" : "Show"} ${view.title}`}
                  >
                    {enabled ? (
                      <Eye className="size-3.5" aria-hidden="true" />
                    ) : (
                      <EyeOff className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                  <span
                    className="size-4 rounded-sm border border-white/20"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => soloLayer(view.id)}
                    className="min-w-0 text-left hover:text-white"
                    title={`Solo ${view.title}`}
                  >
                    <span className="mr-2 text-xs tabular-nums text-slate-500">
                      {layerNumber(view.title, index)}
                    </span>
                    <span className={`truncate ${missing ? "line-through decoration-slate-500" : ""}`}>
                      {shortLayerTitle(view.title)}
                    </span>
                  </button>
                  <span className="text-right text-[10px] uppercase tracking-wide text-slate-600">
                    {missing ? "Miss" : enabled ? "On" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={showAllLayers}
              className="rounded border border-line-soft bg-[#141922] px-3 py-2 text-xs font-medium text-slate-200 hover:border-copper/45"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setEnabledIds(new Set())}
              className="rounded border border-line-soft bg-[#141922] px-3 py-2 text-xs font-medium text-slate-200 hover:border-copper/45"
            >
              Clear
            </button>
          </div>

          <div className="rounded border border-line-soft bg-[#111720] p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Visible</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{activeLayerLabel}</p>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="sticky top-[57px] z-20 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-line-soft bg-[#0d121a]/95 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(value - 0.15, 0.5))}
              aria-label="Zoom out"
              title="Zoom out"
              className="grid size-9 place-items-center rounded border border-line-soft bg-[#141922] text-slate-200 hover:border-signal/45"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="min-w-16 text-center text-xs tabular-nums text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(value + 0.15, 3))}
              aria-label="Zoom in"
              title="Zoom in"
              className="grid size-9 place-items-center rounded border border-line-soft bg-[#141922] text-slate-200 hover:border-signal/45"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="Reset view"
              title="Reset view"
              className="grid size-9 place-items-center rounded border border-line-soft bg-[#141922] text-slate-200 hover:border-signal/45"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
            <Maximize className="ml-1 hidden size-4 text-slate-600 sm:block" aria-hidden="true" />
          </div>
          <div className="text-xs text-slate-500">{activeLayerLabel}</div>
        </div>

        <div
          className="viewer-scrollbar h-[calc(100vh-113px)] cursor-grab overflow-hidden bg-[#e5ebf1] active:cursor-grabbing"
          onWheel={(event) => {
            event.preventDefault();
            const direction = event.deltaY > 0 ? -0.12 : 0.12;
            setZoom((value) => Math.min(Math.max(value + direction, 0.5), 3));
          }}
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
            setPan({
              x: dragStart.current.pan.x + event.clientX - dragStart.current.x,
              y: dragStart.current.pan.y + event.clientY - dragStart.current.y,
            });
          }}
          onPointerUp={() => {
            dragStart.current = null;
          }}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
        >
          <div
            className="relative mx-auto my-8 aspect-square origin-center rounded border border-slate-300 bg-white p-10 shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
            style={{
              width: "min(calc(100% - 2rem), calc(100vh - 10rem), 54rem)",
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <div className="absolute inset-6 rounded-sm border border-slate-300/80 bg-white" />

            {enabledViews.length === 0 ? (
              <div className="absolute inset-6 grid place-items-center">
                <EmptyState
                  title="No rendered PCB view selected"
                  message="Enable at least one copper layer, or add generated SVGs under public/generated/[slug]/layout."
                />
              </div>
            ) : (
              <div className="absolute inset-10">
                {enabledViews.map((view, index) => {
                  const assetUrl = getAssetUrl(view.file);
                  const color = layerColor(view);
                  const maskUrl = `url("${assetUrl}")`;
                  const layerStyle: CSSProperties = {
                    backgroundColor: color,
                    opacity: enabledViews.length === 1 ? 0.95 : Math.max(0.4, 0.84 - index * 0.07),
                    mixBlendMode: "multiply",
                    WebkitMaskImage: maskUrl,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskImage: maskUrl,
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    maskSize: "contain",
                  };

                  return (
                    <div key={view.id} className="absolute inset-0">
                      <img
                        src={assetUrl}
                        alt=""
                        aria-hidden="true"
                        className="hidden"
                        onError={() =>
                          setMissingAssetIds((current) => new Set(current).add(view.id))
                        }
                      />
                      <div className="absolute inset-0" style={layerStyle} />
                    </div>
                  );
                })}
              </div>
            )}

            {activeCallouts.length > 0 ? (
              <HotspotOverlay
                items={activeCallouts}
                activeId={selectedCallout?.id}
                onSelect={setSelectedCallout}
                tone="copper"
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
