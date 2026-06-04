import Link from "next/link";
import { BookOpen, ClipboardCheck, Cpu, FileStack } from "lucide-react";

interface ProjectNavCardsProps {
  slug: string;
}

const cards = [
  {
    title: "Schematic Viewer",
    href: "schematic",
    icon: FileStack,
    text: "Click through exported schematic pages with manually defined hotspots.",
  },
  {
    title: "PCB Layout Viewer",
    href: "layout",
    icon: Cpu,
    text: "Inspect Gerber-derived top and bottom SVG renders with layout callouts.",
  },
  {
    title: "Wiki / Design Notes",
    href: "wiki",
    icon: BookOpen,
    text: "Read architecture, decisions, bring-up, failures, and revision history.",
  },
  {
    title: "Test Evidence",
    href: "tests",
    icon: ClipboardCheck,
    text: "Review validation cases, captures, thermal images, and lab photos.",
  },
];

export function ProjectNavCards({ slug }: ProjectNavCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={`/projects/${slug}/${card.href}`}
            className="rounded-lg border border-line-soft bg-panel p-5 transition hover:border-signal/45 hover:bg-panel-soft"
          >
            <Icon className="mb-4 size-6 text-signal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
          </Link>
        );
      })}
    </section>
  );
}
