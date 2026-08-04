import { useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function CursorStyleUpdater() {
  const { theme } = useTheme();

  useEffect(() => {
    // SVG cursor untuk light mode (hitam)
    const lightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M4.5.79v22.42l6.56-6.57h9.29L4.5.79z'%3E%3C/path%3E%3C/svg%3E") 0 0, pointer`;
    // SVG cursor untuk dark mode (merah #EF4444)
    const darkCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23EF4444' d='M4.5.79v22.42l6.56-6.57h9.29L4.5.79z'%3E%3C/path%3E%3C/svg%3E") 0 0, pointer`;

    document.body.style.cursor = theme === "dark" ? darkCursor : lightCursor;
  }, [theme]);

  return null;
}