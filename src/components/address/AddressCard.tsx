import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import type { Address } from "@/data/addresses";

interface Props {
  address: Address;
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
    <div className="border border-line rounded-xl p-4 bg-surface flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-ink-soft bg-cream-deep rounded-full px-2.5 py-1">
          <Icon icon="mdi:home-outline" width={14} />
          {address.label}
        </span>
        {address.isPrimary && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-ok/10 text-ok">
            Utama
          </span>
        )}
      </div>

      <p className="text-[13.5px] font-bold text-ink mt-1">{address.recipientName}</p>
      <p className="text-[12.5px] text-muted">{address.phone}</p>
      <p className="text-[12.5px] text-ink-soft leading-relaxed">
        {address.fullAddress}, {address.city}, {address.province} {address.postalCode}
      </p>

      <div className="flex items-center gap-3.5 flex-wrap mt-2 pt-2.5 border-t border-line">
        {onEdit && (
          <Button
            variant="ghost"
            onClick={onEdit}
            className="h-auto! w-auto! p-0! border-none! text-brand! text-[12.5px] hover:bg-transparent! hover:underline"
          >
            Ubah Alamat
          </Button>
        )}
        {!address.isPrimary && onMakePrimary && (
          <Button
            variant="ghost"
            onClick={onMakePrimary}
            className="h-auto! w-auto! p-0! border-none! text-brand! text-[12.5px] hover:bg-transparent! hover:underline"
          >
            {selectable ? "Jadikan Utama & Pilih" : "Jadikan Alamat Utama"}
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            onClick={onDelete}
            className="h-auto! w-auto! p-0! border-none! text-warn! text-[12.5px] hover:bg-transparent! hover:underline"
          >
            Hapus
          </Button>
        )}
        {selectable && onSelect && (
          <Button variant="primary" size="sm" onClick={onSelect} className="ml-auto h-8! px-4!">
            Pilih
          </Button>
        )}
      </div>
    </div>
  );
}
