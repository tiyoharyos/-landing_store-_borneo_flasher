import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProductCard from "@/components/ProductCard";
import AnimatedGrid, { AnimatedGridItem } from "@/components/AnimatedGrid";
import FadeIn from "@/components/FadeIn";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import NameEditModal from "@/components/NameEditModal";
import PhoneEditModal from "@/components/PhoneEditModal";
import AddressCard from "@/components/address/AddressCard";
import AddressFormModal from "@/components/address/AddressFormModal";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAddresses } from "@/context/AddressContext";
import { getOrders, ORDER_STATUS_STYLES, type Order } from "@/data/orders";
import { formatRupiah } from "@/data/products";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/Toast";
import { fileToDataUrl, validateAvatarFile } from "@/lib/file";
import type { Address } from "@/data/addresses";
import SafeImage from "@/components/SafeImage";

type ProfileTab = "pesanan" | "wishlist" | "biodata" | "alamat";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { items: wishlistItems, totalItems: wishlistCount } = useWishlist();
  const { addresses, removeAddress, makePrimary } = useAddresses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const toast = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const tabFromUrl = searchParams.get("tab");
  const [tab, setTab] = useState<ProfileTab>(
    tabFromUrl === "wishlist" || tabFromUrl === "pesanan" || tabFromUrl === "alamat" ? tabFromUrl : "biodata"
  );

  useEffect(() => {
    if (user) setOrders(getOrders(user.email));
  }, [user]);

  if (!user) return <Navigate to="/masuk?next=/akun/profil" replace />;

  const changeTab = (next: ProfileTab) => {
    setTab(next);
    setSearchParams(next === "biodata" ? {} : { tab: next }, { replace: true });
  };

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  const openNameModal = () => setNameModalOpen(true);
  const openPhoneModal = () => setPhoneModalOpen(true);

  const handlePickAvatar = () => avatarInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.ok) {
      toast.error("File tidak valid", validation.message);
      return;
    }

    setUploadingAvatar(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await updateProfile({ name: user.name, phone: user.phone, avatar: dataUrl });
      if (!res.ok) {
        toast.error("Gagal memperbarui foto", res.message);
        return;
      }
      toast.success("Foto profil diperbarui");
    } catch {
      toast.error("Gagal memuat foto", "Coba pilih file lain.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressFormOpen(true);
  };
  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressFormOpen(true);
  };

  const handleDeleteAddress = async (address: Address) => {
    const res = await Swal.fire({
      icon: "question",
      title: "Hapus alamat ini?",
      text: `Alamat "${address.label}" akan dihapus dari daftar.`,
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--brand)",
    });
    if (res.isConfirmed) removeAddress(address.id);
  };

  const handleLogout = async () => {
    const res = await Swal.fire({
      icon: "question",
      title: "Keluar dari akun?",
      text: "Kamu perlu masuk lagi untuk mengakses akun dan pesananmu.",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    });
    if (res.isConfirmed) logout();
  };

  const navItemClass = (active: boolean, extra = "") =>
    `flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-[10px] border-none bg-transparent text-[13.5px] font-semibold cursor-pointer transition-colors duration-200 ${
      active ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
    } ${extra}`;

  const tabBtnClass = (active: boolean) =>
    `border-none bg-transparent px-2.5 py-3.5 text-[13.5px] font-bold cursor-pointer border-b-2 whitespace-nowrap transition-colors duration-200 ${
      active ? "text-brand border-brand" : "text-muted border-transparent"
    }`;

  return (
    <div>
      <div className="container grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4.5 gap-x-4 pt-6 pb-12 items-start">
        <FadeIn y={8} className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="flex flex-col items-center text-center px-4 py-6 border-b border-line">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Foto profil"
                className="w-16 h-16 rounded-full object-cover border border-line mb-2.5"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center font-display font-extrabold text-2xl mb-2.5">
                {initial}
              </div>
            )}
            <p className="font-bold text-[14.5px] text-ink">{user.name}</p>
            <p className="text-xs text-muted mt-0.5 break-all">{user.email}</p>
          </div>

          <nav className="flex flex-col p-2.5 gap-0.5">
            <button type="button" className={navItemClass(tab === "pesanan")} onClick={() => changeTab("pesanan")}>
              <Icon icon="mdi:receipt-text-outline" width={18} />
              Pesanan Saya
              {orders.length > 0 && (
                <span className="ml-auto bg-brand text-white text-[10.5px] font-bold rounded-full px-[7px]">{orders.length}</span>
              )}
            </button>

            <button type="button" className={navItemClass(tab === "wishlist")} onClick={() => changeTab("wishlist")}>
              <Icon icon="mdi:heart-outline" width={18} />
              Wishlist Saya
              {wishlistCount > 0 && (
                <span className="ml-auto bg-brand text-white text-[10.5px] font-bold rounded-full px-[7px]">{wishlistCount}</span>
              )}
            </button>

            <p className="text-[11px] font-bold uppercase tracking-wide text-muted px-3 pt-3.5 pb-1">Profil Saya</p>
            <button type="button" className={navItemClass(tab === "biodata", "pl-5 font-medium")} onClick={() => changeTab("biodata")}>
              Biodata Diri
            </button>
            <button type="button" className={navItemClass(tab === "alamat", "pl-5 font-medium")} onClick={() => changeTab("alamat")}>
              Alamat Tersimpan
              {addresses.length > 0 && (
                <span className="ml-auto bg-brand text-white text-[10.5px] font-bold rounded-full px-[7px]">{addresses.length}</span>
              )}
            </button>

            <button type="button" className={`${navItemClass(false)} text-warn mt-1.5`} onClick={handleLogout}>
              <Icon icon="mdi:logout" width={18} />
              Keluar
            </button>
          </nav>
        </FadeIn>

        <FadeIn y={8} delay={0.06} className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="flex gap-1 border-b border-line px-4 overflow-x-auto">
            <button type="button" className={tabBtnClass(tab === "pesanan")} onClick={() => changeTab("pesanan")}>
              Pesanan Saya{orders.length > 0 ? ` (${orders.length})` : ""}
            </button>
            <button type="button" className={tabBtnClass(tab === "wishlist")} onClick={() => changeTab("wishlist")}>
              Wishlist Saya{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </button>
            <button type="button" className={tabBtnClass(tab === "biodata")} onClick={() => changeTab("biodata")}>
              Biodata Diri
            </button>
            <button type="button" className={tabBtnClass(tab === "alamat")} onClick={() => changeTab("alamat")}>
              Alamat Tersimpan{addresses.length > 0 ? ` (${addresses.length})` : ""}
            </button>
          </div>

          {tab === "pesanan" && (
            <div className="p-5">
              {orders.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Icon icon="mdi:receipt-text-outline" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4">Belum Ada Pesanan</p>
                  <p className="text-muted text-sm mt-1">Pesanan yang kamu buat akan muncul di sini.</p>
                  <ButtonLink to="/" variant="outline" size="sm" className="mt-4 border-brand! text-brand! hover:bg-brand-tint!">
                    Mulai Belanja
                  </ButtonLink>
                </div>
              ) : (
                <AnimatedGrid className="flex flex-col gap-4">
                  {orders.map((o) => (
                    <AnimatedGridItem key={o.id}>
                      <div className="bg-surface border border-line rounded-xl px-5 py-4.5">
                      <div className="flex justify-between items-center pb-2.5 border-b border-line mb-2.5">
                        <div>
                          <p className="font-mono font-bold text-brand-dark">{o.id}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold whitespace-nowrap ${ORDER_STATUS_STYLES[o.status]}`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {o.items.map((i) => (
                          <div key={i.productId} className="flex items-center gap-2.5 text-[13px]">
                            <SafeImage src={i.image} alt={i.name} className="w-9 h-9 rounded-lg object-cover bg-cream-deep" />
                            <span className="flex-1">
                              {i.name} x{i.qty}
                            </span>
                            <span>{formatRupiah(i.price * i.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2.5 pt-2.5 border-t border-line text-[13.5px] font-bold">
                        <span>Total Bayar</span>
                        <span className="font-mono text-brand-dark">{formatRupiah(o.total)}</span>
                      </div>
                      </div>
                    </AnimatedGridItem>
                  ))}
                </AnimatedGrid>
              )}
            </div>
          )}

          {tab === "biodata" && (
            <div className="p-5 grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-6 sm:gap-8">
              <div>
                <div className="w-full sm:w-[230px] border border-line rounded-xl overflow-hidden flex flex-col">
                  <div className="aspect-square w-full bg-cream-deep overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Foto profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-tint text-brand font-display font-extrabold text-6xl">
                        {initial}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    fullWidth
                    loading={uploadingAvatar}
                    onClick={handlePickAvatar}
                    disabled={uploadingAvatar}
                    className="border-t! border-line! rounded-none! text-ink hover:bg-cream-deep!"
                  >
                    {uploadingAvatar ? "Mengunggah..." : "Pilih Foto"}
                  </Button>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-muted mt-2.5 leading-relaxed">
                  Besar file: maksimum 10.000.000 bytes (10 Megabytes).
                  <br />
                  Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                </p>
              </div>

              <div>
                <p className="font-display font-extrabold text-base text-ink mb-1">Ubah Biodata Diri</p>

                <div className="flex items-center gap-3 py-3.5 border-b border-line flex-wrap">
                  <span className="w-[120px] flex-shrink-0 text-[13px] text-muted font-semibold">Nama</span>
                  <span className="text-[13.5px] text-ink font-semibold">{user.name}</span>
                  <Button
                    variant="ghost"
                    onClick={openNameModal}
                    className="ml-auto h-auto! w-auto! p-0! border-none! text-brand! text-[13px] hover:bg-transparent! hover:underline"
                  >
                    Ubah
                  </Button>
                </div>

                <p className="font-display font-extrabold text-base text-ink mt-5 mb-1">Ubah Kontak</p>

                <div className="flex items-center gap-3 py-3.5 border-b border-line flex-wrap">
                  <span className="w-[120px] flex-shrink-0 text-[13px] text-muted font-semibold">Email</span>
                  <span className="text-[13.5px] text-ink font-semibold">{user.email}</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold bg-ok/10 text-ok">Terverifikasi</span>
                </div>

                <div className="flex items-center gap-3 py-3.5 flex-wrap">
                  <span className="w-[120px] flex-shrink-0 text-[13px] text-muted font-semibold">Nomor HP</span>
                  <span className={`text-[13.5px] font-medium ${user.phone ? "text-ink font-semibold" : "text-muted"}`}>
                    {user.phone || "Belum ditambahkan"}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={openPhoneModal}
                    className="ml-auto h-auto! w-auto! p-0! border-none! text-brand! text-[13px] hover:bg-transparent! hover:underline"
                  >
                    {user.phone ? "Ubah" : "Tambah"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "alamat" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="font-display font-extrabold text-base text-ink">Alamat Tersimpan</p>
                <Button variant="primary" size="sm" icon="mdi:plus" onClick={openAddAddress} className="h-9!">
                  Tambah Alamat Baru
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Icon icon="mdi:map-marker-off-outline" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4">Belum Ada Alamat Tersimpan</p>
                  <p className="text-muted text-sm mt-1">Tambahkan alamat supaya checkout jadi lebih cepat.</p>
                </div>
              ) : (
                <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {addresses.map((a) => (
                    <AnimatedGridItem key={a.id}>
                      <AddressCard
                        address={a}
                        onEdit={() => openEditAddress(a)}
                        onDelete={() => handleDeleteAddress(a)}
                        onMakePrimary={() => makePrimary(a.id)}
                      />
                    </AnimatedGridItem>
                  ))}
                </AnimatedGrid>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="p-5">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Icon icon="mdi:heart-outline" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4">Wishlist Kamu Masih Kosong</p>
                  <p className="text-muted text-sm mt-1">
                    Simpan produk favoritmu dengan tap ikon hati pada produk.
                  </p>
                  <ButtonLink to="/" variant="outline" size="sm" className="mt-4 border-brand! text-brand! hover:bg-brand-tint!">
                    Mulai Belanja
                  </ButtonLink>
                </div>
              ) : (
                <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlistItems.map((p) => (
                    <AnimatedGridItem key={p.id}>
                      <ProductCard product={p} />
                    </AnimatedGridItem>
                  ))}
                </AnimatedGrid>
              )}
            </div>
          )}
        </FadeIn>
      </div>

      <NameEditModal open={nameModalOpen} onClose={() => setNameModalOpen(false)} />
      <PhoneEditModal open={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} />
      <AddressFormModal
        open={addressFormOpen}
        onClose={() => setAddressFormOpen(false)}
        editing={editingAddress}
      />
    </div>
  );
}
