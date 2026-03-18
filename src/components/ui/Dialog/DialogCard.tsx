import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "../IconButton";
import { cardStyles } from "./card.styles";

interface DialogCardProps {
  title: string;
  onClose: () => void;
  /** Body content. For a simple text message use the `message` shorthand. */
  children?: ReactNode;
  footer: ReactNode;
  /** Defaults to cardStyles.footer (justify-between). Use cardStyles.footerEnd for single-button dialogs. */
  footerClass?: string;
}

export function DialogCard({
  title,
  onClose,
  children,
  footer,
  footerClass = cardStyles.footer,
}: DialogCardProps) {
  return (
    <div className={cardStyles.base}>
      <div className={cardStyles.header}>
        <span className={cardStyles.headerTitle}>{title}</span>
        <IconButton variant="ghost" icon={X} onClick={onClose} />
      </div>
      {children && <div className={cardStyles.body}>{children}</div>}
      <div className={footerClass}>{footer}</div>
    </div>
  );
}
