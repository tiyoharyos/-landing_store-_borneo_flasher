import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, select, textarea, label, summary, [data-cursor='pointer']";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useRef<number>(0);
  const cursorY = useRef<number>(0);
  const targetX = useRef<number>(0);
  const targetY = useRef<number>(0);
  const scale = useRef<number>(1);
  const targetScale = useRef<number>(1);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {

    const lerp = (start: number, end: number, factor: number): number =>
      start * (1 - factor) + end * factor;

    const updateCursor = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(INTERACTIVE_SELECTOR);
      targetScale.current = isInteractive ? 1.7 : 1;
      cursorRef.current?.classList.toggle("is-pointer", isInteractive);
    };

    const hideCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const showCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const handleDown = () => {
      cursorRef.current?.classList.add("is-down");
      targetScale.current = 0.85;
    };

    const handleUp = () => {
      cursorRef.current?.classList.remove("is-down");
      targetScale.current = cursorRef.current?.classList.contains("is-pointer") ? 1.7 : 1;
    };

    const animateCursor = () => {
      cursorX.current = lerp(cursorX.current, targetX.current, 0.18);
      cursorY.current = lerp(cursorY.current, targetY.current, 0.18);
      scale.current = lerp(scale.current, targetScale.current, 0.25);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX.current}px, ${cursorY.current}px) scale(${scale.current})`;
      }

      animFrameRef.current = requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    animFrameRef.current = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
