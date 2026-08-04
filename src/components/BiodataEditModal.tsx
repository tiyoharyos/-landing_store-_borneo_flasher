import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Field yang difokuskan saat modal dibuka */
  initialField?: "name" | "phone";
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

export default function BiodataEditModal({ open, onClose, initialField = "name" }: Props) {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name ?? "");
      setPhone(user?.phone ?? "");
      setAvatar(user?.avatar ?? null);
      setError("");
    }
  }, [open, user]);

  const initial = (user?.name ?? "U").trim().charAt(0).toUpperCase() || "U";

  const handlePickPhoto = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File tidak didukung", "Pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Ukuran terlalu besar", "Maksimal ukuran foto adalah 2MB.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setAvatar(dataUrl);
    } catch {
      toast.error("Gagal memuat foto", "Coba pilih file lain.");
    }
  };

  const handleRemovePhoto = () => setAvatar(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setSubmitting(true);
    updateProfile({ name: name.trim(), phone: phone.trim(), avatar: avatar ?? null });
    setSubmitting(false);
    toast.success("Biodata diperbarui");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ubah Biodata Diri" maxWidth={420}>
      <div className="flex flex-col items-center gap-2.5 pb-1">
        <div className="relative w-20 h-20">
          {avatar ? (
            <img
              src={avatar}
              alt="Foto profil"
              className="w-20 h-20 rounded-full object-cover border border-line"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand text-white flex items-center justify-center font-display font-extrabold text-2xl">
              {initial}
            </div>
          )}
          <button
            type="button"
            onClick={handlePickPhoto}
            className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center text-ink-soft cursor-pointer hover:bg-cream-deep hover:text-brand transition-colors"
            aria-label="Ganti foto profil"
          >
            <Icon icon="mdi:camera-outline" width={15} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-3 text-[12.5px] font-bold">
          <button
            type="button"
            className="bg-transparent border-none text-brand cursor-pointer hover:underline"
            onClick={handlePickPhoto}
          >
            Ganti Foto
          </button>
          {avatar && (
            <button
              type="button"
              className="bg-transparent border-none text-warn cursor-pointer hover:underline"
              onClick={handleRemovePhoto}
            >
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <Input
          label="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap"
          error={error}
          autoFocus={initialField === "name"}
        />
        <Input
          label="Nomor HP"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          autoFocus={initialField === "phone"}
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
        <Button variant="subtle" onClick={onClose} type="button">
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting} type="button">
          Simpan
        </Button>
      </div>
    </Modal>
  );
}
