import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NameEditModal({ open, onClose }: Props) {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name ?? "");
      setError("");
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setSubmitting(true);
    updateProfile({ name: name.trim(), phone: user?.phone });
    setSubmitting(false);
    toast.success("Nama berhasil diperbarui");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ubah Nama" maxWidth={420}>
      <Input
        label="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama lengkap"
        error={error}
        autoFocus
      />

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
