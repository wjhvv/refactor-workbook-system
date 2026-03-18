import { DialogCard } from "./DialogCard";
import { DialogOverlay } from "./DialogOverlay";
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
    <DialogCard
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className={cardStyles.cancelButton} onClick={onClose}>
            {cancelLabel}
          </button>
          <button className={cardStyles.confirmButton} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      {message && <p className={cardStyles.message}>{message}</p>}
    </DialogCard>
  );
}

export function ConfirmDialog({
  isOpen,
  ...cardProps
}: ConfirmCardProps & { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <DialogOverlay>
      <ConfirmCard {...cardProps} />
    </DialogOverlay>
  );
}
