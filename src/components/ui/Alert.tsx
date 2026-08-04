import type { ComponentType } from "react";
import { FiX, FiCheck, FiInfo, FiAlertCircle } from "react-icons/fi";

export type AlertType = "success" | "warning" | "error" | "info";

interface AlertVariant {
  bg: string;
  border: string;
  titleColor: string;
  descColor: string;
  iconBg: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  closeColor: string;
}

const VARIANTS: Record<AlertType, AlertVariant> = {
  success: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border border-green-100 dark:border-green-900/30",
    titleColor: "text-green-800 dark:text-green-200",
    descColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-500 text-white",
    icon: FiCheck,
    closeColor: "text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border border-amber-100 dark:border-amber-900/30",
    titleColor: "text-amber-800 dark:text-amber-200",
    descColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500 text-white",
    icon: FiAlertCircle,
    closeColor: "text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border border-red-100 dark:border-red-900/30",
    titleColor: "text-red-800 dark:text-red-200",
    descColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-500 text-white",
    icon: FiX,
    closeColor: "text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40",
  },
  info: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    border: "border border-indigo-100 dark:border-indigo-900/30",
    titleColor: "text-indigo-800 dark:text-indigo-200",
    descColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-500 text-white",
    icon: FiInfo,
    closeColor: "text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
  },
};

interface AlertProps {
  type?: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ type = "success", title, message, onClose, className = "" }: AlertProps) {
  const config = VARIANTS[type] ?? VARIANTS.success;
  const IconComp = config.icon;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-3xl shadow-sm ${config.bg} ${config.border} w-full transition-all duration-300 ${className}`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg}`}>
        <IconComp size={16} className="stroke-[3]" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className={`text-[14px] font-bold leading-tight ${config.titleColor}`}>{title}</h4>
        {message && <p className={`text-[12px] mt-1 leading-relaxed ${config.descColor}`}>{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${config.closeColor}`}
        >
          <FiX size={14} className="stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
