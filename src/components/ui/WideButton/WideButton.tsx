import type { LucideIcon } from "lucide-react";
import { wideButtonStyles } from "./wideButton.styles";

interface WideButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

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
      className={`${wideButtonStyles.base} ${wideButtonStyles[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
