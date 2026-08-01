import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormRow, FormSpan } from "@/components/ui/FormLayout";
import { useAddresses } from "@/context/AddressContext";
import { useAuth } from "@/context/AuthContext";
import type { Address, AddressInput } from "@/data/addresses";

const LABEL_OPTIONS = [
  { value: "Rumah", label: "Rumah" },
  { value: "Kantor", label: "Kantor" },
  { value: "Kos", label: "Kos / Kontrakan" },
  { value: "Lainnya", label: "Lainnya" },
];

const emptyForm: AddressInput = {
  label: "Rumah",
  recipientName: "",
  phone: "",
  fullAddress: "",
  city: "",
  postalCode: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** Kalau diisi, modal jadi mode "ubah" untuk alamat ini */
  editing?: Address | null;
  /** Dipanggil setelah alamat berhasil disimpan (baik tambah maupun ubah) */
  onSaved?: (address: Address) => void;
}

export default function AddressFormModal({ open, onClose, editing, onSaved }: Props) {
  const { user } = useAuth();
  const { addAddress, editAddress } = useAddresses();
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [makePrimary, setMakePrimary] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const { id: _id, isPrimary, ...rest } = editing;
      void _id;
      setForm(rest);
      setMakePrimary(isPrimary);
    } else {
      setForm({ ...emptyForm, recipientName: user?.name ?? "", phone: user?.phone ?? "" });
      setMakePrimary(false);
    }
    setErrors({});
  }, [open, editing, user]);

  const setField = (key: keyof AddressInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.recipientName.trim()) nextErrors.recipientName = "Nama penerima wajib diisi.";
    if (!form.phone.trim()) nextErrors.phone = "No. HP wajib diisi.";
    if (!form.fullAddress.trim()) nextErrors.fullAddress = "Alamat lengkap wajib diisi.";
    if (!form.city.trim()) nextErrors.city = "Kota/kabupaten wajib diisi.";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Kode pos wajib diisi.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (editing) {
        editAddress(editing.id, form);
        onSaved?.({ ...editing, ...form, isPrimary: makePrimary || editing.isPrimary });
      } else {
        const created = addAddress(form, makePrimary);
        onSaved?.(created);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Ubah Alamat" : "Tambah Alamat Baru"} maxWidth={560}>
      <FormRow columns={2}>
        <Select
          label="Label Alamat"
          options={LABEL_OPTIONS}
          value={form.label}
          onChange={setField("label")}
        />
        <Input
          label="Nama Penerima"
          value={form.recipientName}
          onChange={setField("recipientName")}
          placeholder="Nama lengkap"
          error={errors.recipientName}
        />
        <Input
          label="No. HP"
          value={form.phone}
          onChange={setField("phone")}
          placeholder="08xxxxxxxxxx"
          error={errors.phone}
        />
        <FormSpan>
          <Textarea
            label="Alamat Lengkap"
            value={form.fullAddress}
            onChange={setField("fullAddress")}
            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
            rows={3}
            error={errors.fullAddress}
          />
        </FormSpan>
        <Input
          label="Kota / Kabupaten"
          value={form.city}
          onChange={setField("city")}
          placeholder="Contoh: Boyolali"
          error={errors.city}
        />
        <Input
          label="Kode Pos"
          value={form.postalCode}
          onChange={setField("postalCode")}
          placeholder="57316"
          error={errors.postalCode}
        />
      </FormRow>

      <label className="flex items-center gap-2 text-[13px] font-semibold text-ink-soft cursor-pointer select-none">
        <input
          type="checkbox"
          className="accent-brand w-4 h-4"
          checked={makePrimary}
          onChange={(e) => setMakePrimary(e.target.checked)}
        />
        Jadikan alamat utama
      </label>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line transition-colors duration-200">
        <Button variant="subtle" onClick={onClose} type="button">
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting} type="button">
          Simpan Alamat
        </Button>
      </div>
    </Modal>
  );
}
