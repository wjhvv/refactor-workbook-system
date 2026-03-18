import { DialogCard } from "./DialogCard";
import { DialogOverlay } from "./DialogOverlay";
import { cardStyles } from "./card.styles";

interface MessageCardProps {
  title: string;
  message?: string;
  onClose: () => void;
  closeLabel?: string;
}

export function MessageCard({
  title,
  message,
  onClose,
  closeLabel = "確認",
}: MessageCardProps) {
  return (
    <DialogCard
      title={title}
      onClose={onClose}
      footerClass={cardStyles.footerEnd}
      footer={
        <button className={cardStyles.closeButton} onClick={onClose}>
          {closeLabel}
        </button>
      }
    >
      {message && <p className={cardStyles.message}>{message}</p>}
    </DialogCard>
  );
}

export function MessageDialog({
  isOpen,
  ...cardProps
}: MessageCardProps & { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <DialogOverlay>
      <MessageCard {...cardProps} />
    </DialogOverlay>
  );
}
