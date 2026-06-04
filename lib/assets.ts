export function getAssetUrl(file: string | undefined): string {
  if (!file) {
    return "";
  }

  if (file.startsWith("/content/")) {
    return `/project-assets${file}`;
  }

  return file;
}
