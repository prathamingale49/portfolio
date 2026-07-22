import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pratham Ingale PCB Portfolio",
  description: "Compact PCB case studies with Altium exports, Gerber SVG viewers, and STEP models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quantico.className}>
        <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-[#0b0d0b]/92 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="text-lg text-[#f4efe3]">Pratham Ingale</span>
              <span className="hidden text-xs uppercase tracking-[0.18em] text-slate-500 sm:inline">
                Hardware
              </span>
            </Link>
            <div className="flex items-center gap-5 text-sm text-slate-300">
              <Link href="/#resume" className="hover:text-[#f4efe3]">
                Resume
              </Link>
              <Link href="/#contact" className="hover:text-[#f4efe3]">
                Contact
              </Link>
              <Link href="/projects" className="hover:text-white">
                Projects
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
