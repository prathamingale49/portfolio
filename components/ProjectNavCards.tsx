import Link from "next/link";
import { BookOpen, Box, Cpu, FileStack } from "lucide-react";

interface ProjectNavCardsProps {
  slug: string;
}

const cards = [
  {
    title: "Schematic",
    href: "schematic",
    icon: FileStack,
    text: "Exported PDF/SVG sheets.",
  },
  {
    title: "Layout",
    href: "layout",
    icon: Cpu,
    text: "Copper layer inspector.",
  },
  {
    title: "3D Model",
    href: "model",
    icon: Box,
    text: "STEP board preview.",
  },
  {
    title: "Notes",
    href: "wiki",
    icon: BookOpen,
    text: "Design wiki and bring-up notes.",
  },
];

export function ProjectNavCards({ slug }: ProjectNavCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={`/projects/${slug}/${card.href}`}
            className="group rounded border border-line-soft bg-panel p-4 transition hover:border-signal/45 hover:bg-panel-soft"
          >
            <div className="flex items-center gap-3">
              <Icon className="size-5 text-signal" aria-hidden="true" />
              <h2 className="text-base font-semibold text-white group-hover:text-signal">{card.title}</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
          </Link>
        );
      })}
    </section>
  );
}
