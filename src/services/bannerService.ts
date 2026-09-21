import api from "@/lib/axios"; // sesuaikan kalau export axios-mu berbeda

/**
 * GET /store/banner
 *
 * st_banner.file_type: 0 = gambar, 1 = video
 * Backend sudah mengirim URL absolut (image_url, video_url, media_url)
 * dan media_type ("image" | "video"), jadi FE tidak perlu membangun URL sendiri.
 */
export interface ApiBanner {
  id?: number | string;
  title?: string | null;
  link?: string | null;
  urutan?: number | string | null;
  file_type: number | string;
  image_url: string | null;
  video_url: string | null;
  media_type: "image" | "video";
  media_url: string | null;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export async function getBanners(): Promise<ApiBanner[]> {
  const res = await api.get<ApiResponse<ApiBanner[]>>("/banner");
  if (!res.data.status) throw new Error(res.data.message);
  return res.data.data ?? [];
}

export default { getBanners };