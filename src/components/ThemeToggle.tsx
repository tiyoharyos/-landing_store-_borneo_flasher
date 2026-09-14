import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      icon={isDark ? "mdi:weather-sunny" : "mdi:weather-night"}
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className={`w-9! h-9! p-0! rounded-full! border-none! hover:text-brand! ${className}`}
    />
  );
}
