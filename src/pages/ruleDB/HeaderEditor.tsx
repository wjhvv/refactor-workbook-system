import { useState } from "react";
import { Plus } from "lucide-react";
import { AliasCard } from "./AliasCard";
import { DialogCard, DialogOverlay } from "../../components/ui/Dialog";
import { cardStyles } from "../../components/ui/Dialog/card.styles";
import { useDisclosure } from "../../hooks/ui/useDisclosure";
import { validateRequired, validateUnique } from "../../utils/validation";
import { ruleDBStyles as s } from "./ruleDB.styles";
import type { HeaderField } from "../../types/ruleDB";

interface HeaderEditorProps {
  fields: HeaderField[];
  onAddField: (name: string) => void;
  onAddAlias: (fieldIndex: number, alias: string) => void;
  onRemoveAlias: (fieldIndex: number, aliasIndex: number) => void;
}

export function HeaderEditor({ fields, onAddField, onAddAlias, onRemoveAlias }: HeaderEditorProps) {
  const dialog = useDisclosure();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    const trimmed = name.trim();
    const err =
      validateRequired(trimmed) ??
      validateUnique(trimmed, fields.map((f) => f.name), "欄位名稱已存在");
    if (err) { setError(err); return; }
    onAddField(trimmed);
    setName("");
    setError("");
    dialog.close();
  }

  function handleClose() {
    dialog.close();
    setName("");
    setError("");
  }

  return (
    <>
      <div className={s.grid}>
        {fields.map((field, i) => (
          <AliasCard
            key={field.name}
            name={field.name}
            aliases={field.aliases}
            onAdd={(alias) => onAddAlias(i, alias)}
            onRemove={(aliasIndex) => onRemoveAlias(i, aliasIndex)}
          />
        ))}
        <button
          onClick={dialog.open}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-accent hover:text-accent transition-colors cursor-pointer min-h-32"
        >
          <Plus size={22} />
          <span className="text-xs font-medium">新增欄位</span>
        </button>
      </div>

      {dialog.isOpen && (
        <DialogOverlay>
          <DialogCard
            title="新增欄位"
            onClose={handleClose}
            footer={
              <>
                <button className={cardStyles.cancelButton} onClick={handleClose}>取消</button>
                <button className={cardStyles.closeButton} onClick={handleConfirm}>新增</button>
              </>
            }
          >
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">欄位名稱</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); if (e.key === "Escape") handleClose(); }}
                className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-accent focus:border-transparent"
              />
              {error && <span className="text-xs text-red-400">{error}</span>}
            </label>
          </DialogCard>
        </DialogOverlay>
      )}
    </>
  );
}
