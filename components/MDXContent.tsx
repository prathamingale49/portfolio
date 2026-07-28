import type React from "react";
import { getAssetUrl } from "@/lib/assets";

interface MDXContentProps {
  source: string;
}

type MdxAttributes = Record<string, string>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return parts.map((part, index) => {
    const code = /^`([^`]+)`$/.exec(part);
    if (code) {
      return <code key={`${part}-${index}`}>{code[1]}</code>;
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={`${part}-${index}`} href={link[2]}>
          {link[1]}
        </a>
      );
    }

    return part;
  });
}

function parseAttributes(raw: string): MdxAttributes {
  const attributes: MdxAttributes = {};
  const matches = raw.matchAll(/([A-Za-z][\w-]*)="([^"]*)"/g);

  for (const match of matches) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderFigure(attributes: MdxAttributes, key: string) {
  const src = attributes.src ?? "";
  const alt = attributes.alt ?? attributes.caption ?? "";

  return (
    <figure key={key} className="not-prose my-7 overflow-hidden rounded border border-line-soft bg-panel">
      <div className="bg-[#0b1018]">
        <img src={getAssetUrl(src)} alt={alt} className="w-full" />
      </div>
      {attributes.caption ? (
        <figcaption className="border-t border-line-soft px-4 py-3 text-sm leading-6 text-slate-400">
          {renderInline(attributes.caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderMeasuredResult(attributes: MdxAttributes, key: string) {
  return (
    <div key={key} className="not-prose my-6 rounded border border-copper/35 bg-copper/10 p-4">
      <p className="text-xs uppercase tracking-wide text-copper">{attributes.label ?? "Measured result"}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Before</p>
          <p className="mt-1 text-2xl font-semibold text-white">{attributes.before ?? "TBD"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">After</p>
          <p className="mt-1 text-2xl font-semibold text-white">{attributes.after ?? "TBD"}</p>
        </div>
      </div>
      {attributes.note ? <p className="mt-3 text-sm leading-6 text-slate-300">{attributes.note}</p> : null}
    </div>
  );
}

function renderDesignDecision(attributes: MdxAttributes, body: string[], key: string) {
  return (
    <aside key={key} className="not-prose my-6 rounded border border-signal/35 bg-signal/10 p-4">
      <p className="text-xs uppercase tracking-wide text-signal">Design decision</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{attributes.title ?? "Decision"}</h3>
      <div className="mt-2 space-y-3 text-sm leading-6 text-slate-300">
        {body
          .join("\n")
          .split(/\n{2,}/)
          .map((paragraph, index) => (
            <p key={`${key}-p-${index}`}>{renderInline(paragraph.replace(/\s+/g, " ").trim())}</p>
          ))}
      </div>
    </aside>
  );
}

export function MDXContent({ source }: MDXContentProps) {
  const lines = source.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    nodes.push(<p key={`p-${nodes.length}`}>{renderInline(text)}</p>);
    paragraph = [];
  }

  function flushList() {
    if (list.length > 0) {
      nodes.push(
        <ul key={`ul-${nodes.length}`}>
          {list.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      list = [];
    }

    if (orderedList.length > 0) {
      nodes.push(
        <ol key={`ol-${nodes.length}`}>
          {orderedList.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      orderedList = [];
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    let componentSource = trimmed;
    if (/^<(Figure|MeasuredResult)\b/.test(trimmed) && !trimmed.endsWith("/>")) {
      index += 1;
      while (index < lines.length && !lines[index].trim().endsWith("/>")) {
        componentSource += ` ${lines[index].trim()}`;
        index += 1;
      }

      if (index < lines.length) {
        componentSource += ` ${lines[index].trim()}`;
      }
    }

    const component = /^<([A-Za-z][\w]*)\s*([\s\S]*?)\/>$/.exec(componentSource);
    if (component) {
      flushParagraph();
      flushList();
      const attributes = parseAttributes(component[2]);

      if (component[1] === "Figure") {
        nodes.push(renderFigure(attributes, `figure-${nodes.length}`));
        continue;
      }

      if (component[1] === "MeasuredResult") {
        nodes.push(renderMeasuredResult(attributes, `result-${nodes.length}`));
        continue;
      }
    }

    const designDecision = /^<DesignDecision\s*([^>]*)>$/.exec(trimmed);
    if (designDecision) {
      flushParagraph();
      flushList();
      const body: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== "</DesignDecision>") {
        body.push(lines[index]);
        index += 1;
      }

      nodes.push(renderDesignDecision(parseAttributes(designDecision[1]), body, `decision-${nodes.length}`));
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
    if (image) {
      flushParagraph();
      flushList();
      nodes.push(<img key={`img-${nodes.length}`} src={getAssetUrl(image[2])} alt={image[1]} />);
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      const id = level >= 2 ? slugify(text) : undefined;
      if (level === 1) {
        nodes.push(<h1 key={`h-${nodes.length}`}>{text}</h1>);
      } else if (level === 2) {
        nodes.push(
          <h2 key={`h-${nodes.length}`} id={id}>
            {text}
          </h2>,
        );
      } else if (level === 3) {
        nodes.push(
          <h3 key={`h-${nodes.length}`} id={id}>
            {text}
          </h3>,
        );
      } else {
        nodes.push(
          <h4 key={`h-${nodes.length}`} id={id}>
            {text}
          </h4>,
        );
      }
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(trimmed);
    if (unordered) {
      flushParagraph();
      orderedList = [];
      list.push(unordered[1]);
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(trimmed);
    if (ordered) {
      flushParagraph();
      list = [];
      orderedList.push(ordered[1]);
      continue;
    }

    if (
      trimmed.includes("|") &&
      index + 1 < lines.length &&
      /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[index + 1].trim())
    ) {
      flushParagraph();
      flushList();
      const headers = splitTableRow(trimmed);
      index += 2;
      const rows: string[][] = [];

      while (index < lines.length && lines[index].trim().includes("|")) {
        rows.push(splitTableRow(lines[index].trim()));
        index += 1;
      }

      index -= 1;
      nodes.push(
        <div key={`table-${nodes.length}`} className="not-prose my-6 overflow-x-auto rounded border border-line-soft">
          <table className="min-w-full border-collapse bg-panel text-sm">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="border-b border-line-soft px-3 py-2 text-left text-xs uppercase tracking-wide text-slate-500">
                    {renderInline(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="border-b border-line-soft last:border-0">
                  {headers.map((header, cellIndex) => (
                    <td key={`${header}-${cellIndex}`} className="px-3 py-2 text-slate-300">
                      {renderInline(row[cellIndex] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return <>{nodes}</>;
}
