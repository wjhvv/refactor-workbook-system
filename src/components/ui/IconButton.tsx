import type { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  variant?: "ghost" | "danger" | "primary";
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const variantStyles: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  ghost: "text-gray-300 hover:text-gray-400 hover:!text-gray-600",
  danger: "text-gray-300 hover:text-gray-400 hover:!text-red-500",
  primary: "text-gray-300 hover:text-gray-400 hover:!text-accent",
};

export function IconButton({
  icon: Icon,
  variant = "ghost",
  size = 14,
  onClick,
}: IconButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // 點擊事件到此為止, 不要再往外擴散
    onClick?.(e);
  }

  return (
    <Icon
      size={size}
      onClick={handleClick}
      className={`transition-colors cursor-pointer ${variantStyles[variant]}`}
    />
  );
}
