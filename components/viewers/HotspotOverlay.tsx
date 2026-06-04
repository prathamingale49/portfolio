"use client";

interface OverlayItem {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HotspotOverlayProps<T extends OverlayItem> {
  items: T[];
  activeId?: string;
  onSelect: (item: T) => void;
  tone?: "signal" | "copper";
}

export function HotspotOverlay<T extends OverlayItem>({
  items,
  activeId,
  onSelect,
  tone = "signal",
}: HotspotOverlayProps<T>) {
  const toneClasses =
    tone === "copper"
      ? "border-copper bg-copper/14 hover:bg-copper/22"
      : "border-signal bg-signal/14 hover:bg-signal/22";

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          title={item.label}
          aria-label={item.label}
          className={`group pointer-events-auto absolute rounded border text-left shadow transition ${toneClasses} ${
            activeId === item.id ? "ring-2 ring-white/70" : ""
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
          }}
        >
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded bg-[#060a0f]/90 px-2 py-1 text-[11px] font-medium leading-tight text-white opacity-0 transition group-hover:opacity-100 sm:opacity-100">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
