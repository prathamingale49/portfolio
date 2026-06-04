"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import type { SchematicHotspot, SchematicPage } from "@/types/project";
import { EmptyState } from "@/components/EmptyState";
import { CalloutPanel } from "@/components/viewers/CalloutPanel";
import { HotspotOverlay } from "@/components/viewers/HotspotOverlay";
import { ViewerToolbar } from "@/components/viewers/ViewerToolbar";

interface SchematicViewerProps {
  slug: string;
  pages: SchematicPage[];
}

interface Pan {
  x: number;
  y: number;
}

export function SchematicViewer({ slug, pages }: SchematicViewerProps) {
  const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id ?? "");
  const [selectedHotspot, setSelectedHotspot] = useState<SchematicHotspot | undefined>();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [missingAsset, setMissingAsset] = useState(false);
  const [trail, setTrail] = useState<SchematicPage[]>(pages[0] ? [pages[0]] : []);
  const dragStart = useRef<{ pointerId: number; x: number; y: number; pan: Pan } | null>(null);

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) ?? pages[0],
    [pages, selectedPageId],
  );

  if (!selectedPage) {
    return (
      <EmptyState
        title="No schematic pages"
        message="Add exported Altium schematic SVG or PDF-derived pages under content/projects/[slug]/schematic and list them in project.json."
      />
    );
  }

  function selectPage(pageId: string, addToTrail = true) {
    const nextPage = pages.find((page) => page.id === pageId);
    if (!nextPage) {
      return;
    }
    setSelectedPageId(nextPage.id);
    setSelectedHotspot(undefined);
    setMissingAsset(false);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    if (addToTrail) {
      setTrail((current) => [...current.filter((page) => page.id !== nextPage.id), nextPage]);
    }
  }

  function selectHotspot(hotspot: SchematicHotspot) {
    setSelectedHotspot(hotspot);
    if (hotspot.type === "page" && hotspot.target) {
      selectPage(hotspot.target);
    } else if (hotspot.type === "wiki" && hotspot.target) {
      window.location.assign(`/projects/${slug}/wiki#${hotspot.target}`);
    }
  }

  const pageIndex = pages.findIndex((page) => page.id === selectedPage.id);
  const toolbarExtra = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => pageIndex > 0 && selectPage(pages[pageIndex - 1].id)}
        disabled={pageIndex <= 0}
        aria-label="Previous schematic page"
        title="Previous page"
        className="grid size-9 place-items-center rounded border border-line-soft bg-[#0b1018] text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => pageIndex < pages.length - 1 && selectPage(pages[pageIndex + 1].id)}
        disabled={pageIndex >= pages.length - 1}
        aria-label="Next schematic page"
        title="Next page"
        className="grid size-9 place-items-center rounded border border-line-soft bg-[#0b1018] text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="grid min-h-[calc(100vh-57px)] grid-cols-1 border-y border-line-soft lg:grid-cols-[17rem_minmax(0,1fr)_22rem]">
      <aside className="border-b border-line-soft bg-panel p-4 lg:border-b-0 lg:border-r">
        <p className="text-xs uppercase tracking-wide text-slate-500">Schematic Pages</p>
        <div className="mt-4 grid gap-2">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => selectPage(page.id)}
              className={`rounded border px-3 py-2 text-left text-sm transition ${
                selectedPage.id === page.id
                  ? "border-signal/50 bg-signal/12 text-white"
                  : "border-line-soft bg-[#0b1018] text-slate-300 hover:border-signal/35"
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>
        {trail.length > 1 ? (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Path</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              {trail.map((page, index) => (
                <button
                  key={`${page.id}-${index}`}
                  type="button"
                  onClick={() => selectPage(page.id, false)}
                  className="rounded border border-line-soft px-2 py-1 hover:border-signal/40 hover:text-white"
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
      <main className="min-w-0 bg-[#080b10]">
        <ViewerToolbar
          zoom={zoom}
          onZoomIn={() => setZoom((value) => Math.min(value + 0.15, 2.5))}
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
            className="relative mx-auto my-8 aspect-[16/10] w-[96%] min-w-[760px] max-w-6xl origin-center rounded border border-line-soft bg-white shadow-glow"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            {missingAsset ? (
              <div className="grid h-full place-items-center bg-[#111827] p-8 text-center">
                <EmptyState
                  title="Schematic export missing"
                  message="Place the exported Altium schematic SVG or a PDF-derived SVG at the file path listed in project.json."
                />
              </div>
            ) : (
              <img
                src={getAssetUrl(selectedPage.file)}
                alt={selectedPage.title}
                className="h-full w-full object-contain"
                draggable={false}
                onError={() => setMissingAsset(true)}
              />
            )}
            <HotspotOverlay
              items={selectedPage.hotspots}
              activeId={selectedHotspot?.id}
              onSelect={selectHotspot}
            />
          </div>
        </div>
      </main>
      <CalloutPanel
        slug={slug}
        title={selectedPage.title}
        description={selectedPage.description}
        selected={selectedHotspot}
        page={selectedPage}
      />
      {selectedHotspot?.type === "wiki" && selectedHotspot.target ? (
        <Link className="sr-only" href={`/projects/${slug}/wiki#${selectedHotspot.target}`}>
          Open selected wiki section
        </Link>
      ) : null}
    </div>
  );
}
