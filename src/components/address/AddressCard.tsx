import { Icon } from "@iconify/react";
import type { Address } from "@/data/addresses";

interface Props {
  address: Address;
  /** Tampilkan tombol "Pilih" (dipakai di modal ganti alamat saat checkout) */
  selectable?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMakePrimary?: () => void;
}

export default function AddressCard({
  address,
  selectable = false,
  onSelect,
  onEdit,
  onDelete,
  onMakePrimary,
}: Props) {
  return (
    <div className="border border-line rounded-2xl p-4 bg-surface flex flex-col gap-1.5 transition-colors duration-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-ink-soft bg-cream-deep rounded-full px-2.5 py-1 transition-colors duration-200">
          <Icon icon="mdi:home-outline" width={14} />
          {address.label}
        </span>
        {address.isPrimary && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-ok/10 text-ok transition-colors duration-200">
            Utama
          </span>
        )}
      </div>

      <p className="text-[13.5px] font-bold text-ink mt-1">{address.recipientName}</p>
      <p className="text-[12.5px] text-muted">{address.phone}</p>
      <p className="text-[12.5px] text-ink-soft leading-relaxed">
        {address.fullAddress}, {address.city} {address.postalCode}
      </p>

      <div className="flex items-center gap-3.5 flex-wrap mt-2 pt-2.5 border-t border-line transition-colors duration-200">
        {onEdit && (
          <button
            type="button"
            className="bg-transparent border-none p-0 text-brand text-[12.5px] font-bold cursor-pointer hover:underline transition-colors duration-200"
            onClick={onEdit}
          >
            Ubah Alamat
          </button>
        )}
        {!address.isPrimary && onMakePrimary && (
          <button
            type="button"
            className="bg-transparent border-none p-0 text-brand text-[12.5px] font-bold cursor-pointer hover:underline transition-colors duration-200"
            onClick={onMakePrimary}
          >
            {selectable ? "Jadikan Utama & Pilih" : "Jadikan Alamat Utama"}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="bg-transparent border-none p-0 text-warn text-[12.5px] font-bold cursor-pointer hover:underline transition-colors duration-200"
            onClick={onDelete}
          >
            Hapus
          </button>
        )}
        {selectable && onSelect && (
          <button
            type="button"
            className="ml-auto h-8 px-4 rounded-lg bg-brand text-white border-none text-[12.5px] font-bold cursor-pointer hover:bg-brand-dark transition-colors"
            onClick={onSelect}
          >
            Pilih
          </button>
        )}
      </div>
    </div>
  );
}
