import { Icon } from "@iconify/react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className={`flex items-center justify-center w-9 h-9 rounded-full text-ink-soft hover:bg-cream-deep hover:text-brand transition-colors ${className}`}
    >
      <Icon icon={isDark ? "mdi:weather-sunny" : "mdi:weather-night"} width={20} />
    </button>
  );
}
