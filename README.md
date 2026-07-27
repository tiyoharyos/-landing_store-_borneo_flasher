# GadgetShop React

Konversi dari project Vue 2 (`gadgetshopvue`) ke React + TypeScript + Vite, menggunakan mock data (tanpa backend) dan tema warna merah (dikonversi dari hijau).

## Struktur

```
src/
  assets/img/     -> gambar & logo
  components/      -> NavbarHome, Footer
  config/          -> config.ts (base url gambar, no. WA, alamat toko)
  data/            -> mockData.ts (produk, mitra, sosmed + helper searchProducts)
  pages/           -> SearchPage (home), MitraPage, MitraDetailPage, NotFoundPage
  router/          -> AppRouter.tsx
```

## Halaman yang dibuat

Project Vue aslinya punya 27 view, tapi cuma 4 route yang aktif di `router/index.js` (sisanya di-comment / belum dipakai — halaman lain seperti Login, Cart, Akun, Checkout dll belum terhubung ke router). Jadi versi React ini fokus ke halaman yang benar-benar jadi landing page publik:

- `/` — Pencarian produk (Home)
- `/mitra` — Daftar mitra/partner toko
- `/mitra/:nameStoreMitra` — Pencarian produk khusus per mitra
- `*` — 404 Not Found

Kalau nanti mau lanjut ke halaman lain (Cart, Login, Akun, Checkout, dst), tinggal bilang aja — strukturnya sudah siap untuk ditambah.

## Menjalankan

```bash
npm install
npm run dev
```
