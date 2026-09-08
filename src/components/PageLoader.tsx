export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <span
        className="w-8 h-8 rounded-full border-[3px] border-line border-t-brand animate-spin"
        aria-label="Memuat halaman..."
        role="status"
      />
    </div>
  );
}
