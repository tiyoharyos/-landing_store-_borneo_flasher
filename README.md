# LPKS Borneo Flasher Indonesia — Landing Page

Landing page React + TypeScript + Vite untuk lembaga pelatihan teknisi HP & Laptop,
distrukturkan dari folder project Vue (`gadgetshopvue.zip`) tapi kontennya di-redesign
total mengacu ke referensi https://borneoflasher.com/Landing (data & copy sudah
diparafrase ulang, bukan salinan literal — asset foto asli tidak ikut dipakai).

## Struktur

```
src/
  assets/img/       -> logo & aset (favicon dsb)
  components/
    Logo.tsx          -> logo SVG + wordmark
    Navbar.tsx         -> navbar sticky + menu anchor
    Hero.tsx           -> hero carousel banner (auto-rotate)
    ClassSection.tsx   -> tab kategori kelas (Offline/Online/Tour/Program Khusus)
    ClassCard.tsx       -> kartu kelas: harga, tanggal, durasi, CTA daftar
    SeatGauge.tsx       -> indikator sisa kursi (gaya gauge sinyal alat servis)
    AboutSection.tsx    -> tentang + statistik + fasilitas
    GallerySection.tsx  -> galeri dokumentasi kegiatan
    FAQSection.tsx / FAQAccordion.tsx -> accordion FAQ
    Footer.tsx          -> footer + tombol WhatsApp mengambang
  config/config.ts    -> nama brand, kontak, alamat, sosmed, helper waLink()
  data/mockData.ts    -> data kelas, banner, galeri, FAQ (mock, tanpa backend)
  pages/
    LandingPage.tsx    -> merakit semua section jadi satu halaman
    NotFoundPage.tsx   -> 404
  router/AppRouter.tsx -> routing (/  dan  *)
```

## Desain

- Font: **Sora** (heading), **Inter** (body), **JetBrains Mono** (harga/label teknis)
- Palet: merah teknisi (`--brand #c0272d`) + amber sinyal (`--amber #f2a93b`) di atas
  krem hangat (`--cream #faf6f1`) — beda dari palet gadget-shop sebelumnya yang lebih
  generik, di sini nuansanya lebih "workshop/teknisi"
- Semua data (kelas, harga, kuota, FAQ, galeri) ada di `src/data/mockData.ts` — tinggal
  edit array-nya kalau mau ganti kelas atau harga

## Menjalankan

```bash
npm install
npm run dev
```
