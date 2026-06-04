import type React from "react";
import { getAssetUrl } from "@/lib/assets";

interface MDXContentProps {
  source: string;
}

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

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
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

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return <>{nodes}</>;
}
