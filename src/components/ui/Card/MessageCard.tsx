import { X } from "lucide-react";
import { IconButton } from "../IconButton";
import { cardStyles } from "./card.styles";

interface MessageCardProps {
  title: string;
  message?: string;
  onClose: () => void;
  closeLabel?: string;
}

export function MessageCard({ title, message, onClose, closeLabel = "確認" }: MessageCardProps) {
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
      <div className={`${cardStyles.footer} justify-end`}>
        <button className={cardStyles.closeButton} onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
