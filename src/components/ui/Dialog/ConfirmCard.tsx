import { X } from "lucide-react";
import { IconButton } from "../IconButton";
import { cardStyles } from "./card.styles";

interface ConfirmCardProps {
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmCard({
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "確定",
  cancelLabel = "取消",
}: ConfirmCardProps) {
  return (
    <div className={cardStyles.base}>
      <div className={cardStyles.header}>
        <span className={cardStyles.headerTitle}>{title}</span>
        <IconButton variant="ghost" icon={X} onClick={onClose} />
      </div>
      {message && (
        <div className={cardStyles.body}>
          <p className={cardStyles.message}>{message}</p>
        </div>
      )}
      <div className={cardStyles.footer}>
        <button className={cardStyles.cancelButton} onClick={onClose}>
          {cancelLabel}
        </button>
        <button className={cardStyles.confirmButton} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, ...cardProps }: ConfirmCardProps & { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <ConfirmCard {...cardProps} />
    </div>
  );
}
