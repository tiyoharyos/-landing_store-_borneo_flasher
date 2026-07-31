import { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "@/components/ui/Modal";
import AddressCard from "@/components/address/AddressCard";
import AddressFormModal from "@/components/address/AddressFormModal";
import { useAddresses } from "@/context/AddressContext";
import { confirmDialog } from "@/components/ui/alert";
import type { Address } from "@/data/addresses";

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (address: Address) => void;
}

export default function AddressListModal({ open, onClose, onPick }: Props) {
  const { addresses, removeAddress, makePrimary } = useAddresses();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleDelete = async (address: Address) => {
    const confirmed = await confirmDialog({
      title: "Hapus alamat ini?",
      text: `Alamat "${address.label}" akan dihapus dari daftar.`,
      danger: true,
    });
    if (confirmed) removeAddress(address.id);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Pilih Alamat Pengiriman" maxWidth={560}>
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 w-full h-11 rounded-xl border-[1.5px] border-dashed border-brand bg-brand-tint text-brand text-[13.5px] font-bold cursor-pointer hover:bg-brand/10 transition-colors"
          onClick={openAdd}
        >
          <Icon icon="mdi:plus" width={18} />
          Tambah Alamat Baru
        </button>

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 px-4">
            <Icon icon="mdi:map-marker-off-outline" width={48} className="text-line" />
            <p className="font-display font-bold text-[1rem] text-ink mt-3">Belum Ada Alamat Tersimpan</p>
            <p className="text-muted text-[13px] mt-1">Tambahkan alamat pertamamu supaya checkout lebih cepat.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((a) => (
              <AddressCard
                key={a.id}
                address={a}
                selectable
                onSelect={() => {
                  onPick(a);
                  onClose();
                }}
                onEdit={() => openEdit(a)}
                onDelete={() => handleDelete(a)}
                onMakePrimary={() => {
                  makePrimary(a.id);
                  onPick({ ...a, isPrimary: true });
                  onClose();
                }}
              />
            ))}
          </div>
        )}
      </Modal>

      <AddressFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        onSaved={(saved) => {
          // Kalau nambah/ubah alamat langsung dari modal checkout, sekalian pilih & tutup.
          onPick(saved);
          onClose();
        }}
      />
    </>
  );
}
