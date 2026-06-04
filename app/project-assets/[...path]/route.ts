import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypeByExtension: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".mdx": "text/plain",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  const requested = params.path.join(path.sep);
  const safeRoot = path.join(process.cwd(), "content");
  const normalized = requested.startsWith(`content${path.sep}`)
    ? requested.slice("content".length + 1)
    : requested;
  const filePath = path.normalize(path.join(safeRoot, normalized));

  if (!filePath.startsWith(safeRoot)) {
    return new NextResponse("Invalid asset path", { status: 400 });
  }

  try {
    const body = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentTypeByExtension[ext] ?? "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("Asset not found", { status: 404 });
  }
}
