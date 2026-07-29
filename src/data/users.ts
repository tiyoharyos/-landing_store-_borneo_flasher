// ==========================================================
// MOCK DATA — Akun Pengguna (Borneo Flasher Store)
// Tidak ada backend sungguhan. Daftar akun demo di bawah ini
// dipakai AuthContext untuk validasi login, dan akun baru dari
// halaman Daftar akan ditambahkan ke daftar ini selama sesi
// browser berjalan (hilang lagi saat refresh full reload module).
// ==========================================================

export interface MockUserRecord {
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
}

// Akun contoh yang bisa langsung dipakai untuk demo/testing login.
export const MOCK_USERS: MockUserRecord[] = [
  {
    name: "Andi Saputra",
    email: "andi@borneoflasher.id",
    password: "andi1234",
    role: "member",
  },
  {
    name: "Siti Rahma",
    email: "siti@borneoflasher.id",
    password: "siti1234",
    role: "member",
  },
  {
    name: "Admin Borneo",
    email: "admin@borneoflasher.id",
    password: "admin123",
    role: "admin",
  },
];

export function findUserByEmail(email: string): MockUserRecord | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function validateCredentials(email: string, password: string): MockUserRecord | undefined {
  const user = findUserByEmail(email);
  if (!user) return undefined;
  return user.password === password ? user : undefined;
}

export function registerMockUser(name: string, email: string, password: string): MockUserRecord {
  const record: MockUserRecord = { name, email, password, role: "member" };
  MOCK_USERS.push(record);
  return record;
}
