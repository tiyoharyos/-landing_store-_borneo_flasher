import notFound404 from "@/assets/img/404.png";

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <img src={notFound404} alt="Halaman tidak ditemukan" />
    </div>
  );
}
