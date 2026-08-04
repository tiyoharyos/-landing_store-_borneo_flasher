export const AVATAR_MAX_SIZE = 10_000_000; // 10.000.000 bytes (~10MB)
export const AVATAR_ALLOWED_EXT = [".jpg", ".jpeg", ".png"];
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export interface FileValidationResult {
  ok: boolean;
  message?: string;
}

/** Validasi foto profil: hanya JPG/JPEG/PNG, maksimal AVATAR_MAX_SIZE bytes. */
export function validateAvatarFile(file: File): FileValidationResult {
  const isAllowedType = AVATAR_ALLOWED_TYPES.includes(file.type.toLowerCase());
  const hasAllowedExt = AVATAR_ALLOWED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext));
  if (!isAllowedType && !hasAllowedExt) {
    return { ok: false, message: "Ekstensi file yang diperbolehkan: JPG, JPEG, PNG." };
  }
  if (file.size > AVATAR_MAX_SIZE) {
    return { ok: false, message: "Besar file maksimum 10.000.000 bytes (10 Megabytes)." };
  }
  return { ok: true };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}
