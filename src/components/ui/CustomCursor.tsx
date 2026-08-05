// component/UI/CustomCursor.tsx


import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);        // ✅ tipe HTMLDivElement
  const cursorX = useRef<number>(0);
  const cursorY = useRef<number>(0);
  const targetX = useRef<number>(0);
  const targetY = useRef<number>(0);
  const animFrameRef = useRef<number>(0);               // ✅ tipe number

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number): number =>
      start * (1 - factor) + end * factor;

    const updateCursor = (e: MouseEvent) => {           // ✅ tipe MouseEvent
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const hideCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const showCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const animateCursor = () => {
      cursorX.current = lerp(cursorX.current, targetX.current, 0.1);
      cursorY.current = lerp(cursorY.current, targetY.current, 0.1);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX.current}px, ${cursorY.current}px)`;
      }

      animFrameRef.current = requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseout", hideCursor);
    document.addEventListener("mouseover", showCursor);
    animFrameRef.current = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseout", hideCursor);
      document.removeEventListener("mouseover", showCursor);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}