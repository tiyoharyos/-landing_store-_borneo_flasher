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

export default function PhoneEditModal({ open, onClose }: Props) {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setPhone(user?.phone ?? "");
      setError("");
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (!user) return;
    setSubmitting(true);
    updateProfile({ name: user.name, phone: phone.trim() });
    setSubmitting(false);
    toast.success("Nomor HP berhasil diperbarui");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ubah Nomor HP" maxWidth={420}>
      <Input
        label="Nomor HP"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="08xxxxxxxxxx"
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
