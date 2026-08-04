import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import ToastAlert, { type AlertType } from "./ToastAlert";

export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

const POSITIONS: ToastPosition[] = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
}

interface ToastItem {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  position: ToastPosition;
}

export interface ToastApi {
  success: (title: string, message?: string, options?: ToastOptions | number) => void;
  warning: (title: string, message?: string, options?: ToastOptions | number) => void;
  error: (title: string, message?: string, options?: ToastOptions | number) => void;
  info: (title: string, message?: string, options?: ToastOptions | number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const getContainerClass = (pos: ToastPosition) => {
  const base = "fixed z-[9999] flex flex-col gap-3 w-full max-w-[400px] pointer-events-none p-4";
  switch (pos) {
    case "top-left":
      return `${base} top-4 left-4`;
    case "top-center":
      return `${base} top-4 left-1/2 -translate-x-1/2`;
    case "top-right":
      return `${base} top-4 right-4`;
    case "bottom-left":
      return `${base} bottom-4 left-4`;
    case "bottom-center":
      return `${base} bottom-4 left-1/2 -translate-x-1/2`;
    case "bottom-right":
      return `${base} bottom-4 right-4`;
    default:
      return `${base} top-4 right-4`;
  }
};

const getAnimationClass = (pos: ToastPosition) => {
  switch (pos) {
    case "top-left":
    case "bottom-left":
      return "animate-slide-in-left";
    case "top-center":
      return "animate-slide-in-top";
    case "bottom-center":
      return "animate-slide-in-bottom";
    case "top-right":
    case "bottom-right":
    default:
      return "animate-slide-in-right";
  }
};

export function ToastProvider({
  children,
  defaultPosition = "top-right",
}: {
  children: ReactNode;
  defaultPosition?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (type: AlertType, title: string, message?: string, options: ToastOptions | number = {}) => {
      let duration = 4000;
      let position = defaultPosition;

      if (typeof options === "number") {
        duration = options;
      } else {
        if (options.duration !== undefined) duration = options.duration;
        if (options.position !== undefined) position = options.position;
      }

      const id = Date.now() + Math.random().toString(36).slice(2, 11);

      setToasts((prev) => [...prev.filter((t) => t.position !== position), { id, type, title, message, position }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [defaultPosition]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast: ToastApi = {
    success: (title, message, options) => show("success", title, message, options),
    warning: (title, message, options) => show("warning", title, message, options),
    error: (title, message, options) => show("error", title, message, options),
    info: (title, message, options) => show("info", title, message, options),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {POSITIONS.map((pos) => {
        const positionToasts = toasts.filter((t) => t.position === pos);
        if (positionToasts.length === 0) return null;
        return (
          <div key={pos} className={getContainerClass(pos)}>
            {positionToasts.map((t) => (
              <ToastAlert
                key={t.id}
                type={t.type}
                title={t.title}
                message={t.message}
                onClose={() => dismiss(t.id)}
                className={`shadow-xl backdrop-blur-md pointer-events-auto w-full ${getAnimationClass(t.position)}`}
              />
            ))}
          </div>
        );
      })}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
