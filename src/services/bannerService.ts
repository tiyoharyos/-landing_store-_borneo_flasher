import api from "@/lib/axios";

export interface ApiBanner {
  id_banner: string | number;
  file_type: string | number;
  title?: string | null;
  link?: string | null;
  link_embed?: string | null;
  image_path?: string | null;
  status: string | number;
  created_at?: string;
  updated_at?: string;
  image_url: string | null;
  video_url: string | null;
  media_type: "image" | "video";
  media_url: string | null;
  urutan?: number | string | null;
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