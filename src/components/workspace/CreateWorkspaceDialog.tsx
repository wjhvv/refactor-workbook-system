import { useState } from "react";
import { DialogCard } from "../ui/Dialog/DialogCard";
import { DialogOverlay } from "../ui/Dialog/DialogOverlay";
import { cardStyles } from "../ui/Dialog/card.styles";

interface CreateWorkspaceCardProps {
  placeholder?: string;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateWorkspaceCard({
  placeholder,
  onClose,
  onCreate,
}: CreateWorkspaceCardProps) {
  const [name, setName] = useState(placeholder ?? "");
  const [error, setError] = useState("");

  function handleClose() {
    setName("");
    setError("");
    onClose();
  }

  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("請輸入群組名稱");
      return;
    }
    onCreate(trimmed);
    setName("");
    setError("");
  }

  return (
    <DialogCard
      title="新增工作群組"
      onClose={handleClose}
      footerClass={cardStyles.footer}
      footer={
        <>
          <button className={cardStyles.cancelButton} onClick={handleClose}>
            取消
          </button>
          <button className={cardStyles.closeButton} onClick={handleConfirm}>
            建立
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">群組名稱</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") handleClose();
          }}
          placeholder={placeholder ?? "輸入群組名稱"}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-accent"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </DialogCard>
  );
}

export function CreateWorkspaceDialog({
  isOpen,
  ...cardProps
}: CreateWorkspaceCardProps & { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <DialogOverlay>
      <CreateWorkspaceCard {...cardProps} />
    </DialogOverlay>
  );
}
