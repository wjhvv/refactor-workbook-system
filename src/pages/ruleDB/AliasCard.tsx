import { useState } from "react";
import { X } from "lucide-react";
import { ConfirmDialog } from "../../components/ui/Dialog";
import { useDeleteConfirm } from "../../hooks/ui/useDeleteConfirm";
import { validateUnique } from "../../utils/validation";
import { ruleDBStyles as s } from "./ruleDB.styles";

interface AliasCardProps {
  name: string;
  aliases: string[];
  onAdd: (alias: string) => void;
  onRemove: (index: number) => void;
}

export function AliasCard({ name, aliases, onAdd, onRemove }: AliasCardProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const deleteConfirm = useDeleteConfirm<number>();

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const err = validateUnique(trimmed, aliases, "已存在相同的 alias");
    if (err) { setError(err); return; }
    onAdd(trimmed);
    setInput("");
    setError("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setInput(""); setError(""); }
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle} title={name}>{name}</span>
          <span className={s.cardCount}>{aliases.length}</span>
        </div>

        <div className={s.aliasList}>
          {aliases.length === 0 && (
            <span className="text-xs text-gray-300 self-center">尚無 alias</span>
          )}
          {aliases.map((alias, i) => (
            <span key={i} className={s.aliasChip}>
              {alias}
              <button
                onClick={() => deleteConfirm.open(i)}
                className={s.aliasChipX}
                aria-label={`刪除 ${alias}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>

        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="輸入 alias，按 Enter 新增"
          className={s.addInput}
        />
        {error && <p className={s.errorText}>{error}</p>}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="刪除 Alias"
        message={`確定要刪除「${deleteConfirm.pending !== null ? aliases[deleteConfirm.pending] : ""}」嗎？`}
        onClose={deleteConfirm.close}
        onConfirm={() => {
          if (deleteConfirm.pending !== null) onRemove(deleteConfirm.pending);
          deleteConfirm.close();
        }}
      />
    </>
  );
}
