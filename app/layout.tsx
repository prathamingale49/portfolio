import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCB Design Portfolio",
  description: "Static-first PCB case-study portfolio for Altium Designer projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-[#080b10]/88 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded border border-signal/35 bg-signal/10 text-sm font-bold text-signal">
                PCB
              </span>
              <span className="text-sm font-semibold tracking-wide text-slate-100">
                Altium Case Studies
              </span>
            </Link>
            <div className="flex items-center gap-5 text-sm text-slate-300">
              <Link href="/projects" className="hover:text-white">
                Projects
              </Link>
              <a href="/docs/roadmap" className="hover:text-white">
                Roadmap
              </a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
