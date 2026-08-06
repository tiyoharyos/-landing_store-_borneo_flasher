import { useEffect } from "react";

export default function CursorStyleUpdater() {
  useEffect(() => {
    const cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23dc2626' d='M4.5.79v22.42l6.56-6.57h9.29L4.5.79z'%3E%3C/path%3E%3C/svg%3E") 0 0, pointer`;

    document.body.style.cursor = cursor;
  }, []);

  return null;
}