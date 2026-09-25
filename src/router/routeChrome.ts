export const NO_CHROME_ROUTES = ["/masuk", "/daftar", "/verifikasi"];

export function routeGroupKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/kategori")) return "kategori";
  return pathname;
}
