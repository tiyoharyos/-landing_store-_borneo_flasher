export const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_BASE_URL ?? "http://localhost/borneo_academy/upload/store/";

export type UploadFolder = "kategori" | "produk" | "banner";

export function resolveUploadUrl(
  filename: string | null | undefined,
  folder: UploadFolder = "kategori"
): string | null {
  if (!filename) return null;
  if (/^https?:\/\//i.test(filename)) return filename;

  if (folder === "produk") {
    return `${UPLOAD_BASE_URL}${folder}/${filename}`;
  }
  return `${UPLOAD_BASE_URL}${filename}`;
}

export function resolveUploadFolderUrl(folder: UploadFolder): string {
  if (folder === "produk") {
    return `${UPLOAD_BASE_URL}${folder}/`;
  }
  return UPLOAD_BASE_URL;
}