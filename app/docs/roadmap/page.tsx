import fs from "node:fs";
import path from "node:path";
import { MDXContent } from "@/components/MDXContent";

export default function RoadmapPage() {
  const source = fs.readFileSync(path.join(process.cwd(), "docs", "roadmap.md"), "utf8");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-signal">
        <MDXContent source={source} />
      </article>
    </main>
  );
}
