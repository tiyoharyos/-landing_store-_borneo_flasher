import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import NameEditModal from "@/components/NameEditModal";
import PhoneEditModal from "@/components/PhoneEditModal";
import AddressCard from "@/components/address/AddressCard";
import AddressFormModal from "@/components/address/AddressFormModal";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAddresses } from "@/context/AddressContext";
import { getOrders, ORDER_STATUS_STYLES, type Order } from "@/data/orders";
import { formatRupiah } from "@/data/products";
import { confirmDialog } from "@/components/ui/swal";
import { useToast } from "@/components/ui/Toast";
import { fileToDataUrl, validateAvatarFile } from "@/lib/file";
import type { Address } from "@/data/addresses";

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
      updateProfile({ name: user.name, phone: user.phone, avatar: dataUrl });
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
    const confirmed = await confirmDialog({
      title: "Hapus alamat ini?",
      text: `Alamat "${address.label}" akan dihapus dari daftar.`,
      danger: true,
    });
    if (confirmed) removeAddress(address.id);
  };

  const handleLogout = async () => {
    const confirmed = await confirmDialog({
      title: "Keluar dari akun?",
      text: "Kamu perlu masuk lagi untuk mengakses akun dan pesananmu.",
      confirmText: "Ya, keluar",
      cancelText: "Batal",
      icon: "question",
    });
    if (confirmed) logout();
  };

  const navItemClass = (active: boolean, extra = "") =>
    `flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-[10px] border-none bg-transparent text-[13.5px] font-semibold cursor-pointer ${
      active ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
    } ${extra}`;

  const tabBtnClass = (active: boolean) =>
    `border-none bg-transparent px-2.5 py-3.5 text-[13.5px] font-bold cursor-pointer border-b-2 whitespace-nowrap ${
      active ? "text-brand border-brand" : "text-muted border-transparent"
    }`;

  return (
    <div>
      <Navbar />
      <div className="container grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4.5 gap-x-4 pt-6 pb-12 items-start">
        <aside className="bg-surface border border-line rounded-2xl overflow-hidden">
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
        </aside>

        <section className="bg-surface border border-line rounded-2xl overflow-hidden">
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
                  <Link to="/" className="mt-4 inline-block border border-brand text-brand text-[13px] font-semibold rounded-full px-6 py-2 hover:bg-brand-tint transition-colors">
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-surface border border-line rounded-2xl px-5 py-4.5">
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
                            <img src={i.image} alt={i.name} className="w-9 h-9 rounded-lg object-cover bg-cream-deep" />
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
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "biodata" && (
            <div className="p-5 grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-6 sm:gap-8">
              {/* Kartu foto profil */}
              <div>
                <div className="w-full sm:w-[230px] border border-line rounded-2xl overflow-hidden flex flex-col">
                  <div className="aspect-square w-full bg-cream-deep overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Foto profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-tint text-brand font-display font-extrabold text-6xl">
                        {initial}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handlePickAvatar}
                    disabled={uploadingAvatar}
                    className="border-t border-line py-3 text-[13px] font-bold text-ink bg-surface cursor-pointer hover:bg-cream-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {uploadingAvatar ? "Mengunggah..." : "Pilih Foto"}
                  </button>
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

              {/* Biodata & kontak */}
              <div>
                <p className="font-display font-extrabold text-base text-ink mb-1">Ubah Biodata Diri</p>

                <div className="flex items-center gap-3 py-3.5 border-b border-line flex-wrap">
                  <span className="w-[120px] flex-shrink-0 text-[13px] text-muted font-semibold">Nama</span>
                  <span className="text-[13.5px] text-ink font-semibold">{user.name}</span>
                  <button
                    type="button"
                    className="ml-auto bg-transparent border-none text-brand text-[13px] font-bold cursor-pointer hover:underline"
                    onClick={openNameModal}
                  >
                    Ubah
                  </button>
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
                  <button
                    type="button"
                    className="ml-auto bg-transparent border-none text-brand text-[13px] font-bold cursor-pointer hover:underline"
                    onClick={openPhoneModal}
                  >
                    {user.phone ? "Ubah" : "Tambah"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "alamat" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="font-display font-extrabold text-base text-ink">Alamat Tersimpan</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand text-white border-none text-[12.5px] font-bold cursor-pointer hover:bg-brand-dark transition-colors"
                  onClick={openAddAddress}
                >
                  <Icon icon="mdi:plus" width={16} />
                  Tambah Alamat Baru
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Icon icon="mdi:map-marker-off-outline" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4">Belum Ada Alamat Tersimpan</p>
                  <p className="text-muted text-sm mt-1">Tambahkan alamat supaya checkout jadi lebih cepat.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {addresses.map((a) => (
                    <AddressCard
                      key={a.id}
                      address={a}
                      onEdit={() => openEditAddress(a)}
                      onDelete={() => handleDeleteAddress(a)}
                      onMakePrimary={() => makePrimary(a.id)}
                    />
                  ))}
                </div>
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
                  <Link to="/" className="mt-4 inline-block border border-brand text-brand text-[13px] font-semibold rounded-full px-6 py-2 hover:bg-brand-tint transition-colors">
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {wishlistItems.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
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
