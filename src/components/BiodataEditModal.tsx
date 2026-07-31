import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { toastSuccess } from "@/components/ui/alert";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Field yang difokuskan saat modal dibuka */
  initialField?: "name" | "phone";
}

export default function BiodataEditModal({ open, onClose, initialField = "name" }: Props) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name ?? "");
      setPhone(user?.phone ?? "");
      setError("");
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setSubmitting(true);
    updateProfile({ name: name.trim(), phone: phone.trim() });
    setSubmitting(false);
    toastSuccess("Biodata diperbarui");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ubah Biodata Diri" maxWidth={420}>
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
