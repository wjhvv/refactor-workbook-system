import type { LucideIcon } from "lucide-react";

interface WideButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<NonNullable<WideButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:bg-gray-200 disabled:text-gray-400",
  outline:
    "border border-accent text-accent bg-white hover:bg-accent-light disabled:border-gray-300 disabled:text-gray-400",
  ghost:
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
  danger:
    "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400",
};

export function WideButton({
  icon: Icon,
  label,
  variant = "primary",
  disabled = false,
  onClick,
}: WideButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
