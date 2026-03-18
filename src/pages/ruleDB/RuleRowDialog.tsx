import { useState, useEffect } from "react";
import { DialogCard, DialogOverlay } from "../../components/ui/Dialog";
import { cardStyles } from "../../components/ui/Dialog/card.styles";
import { validateRequired } from "../../utils/validation";
import { RULE_DB_CATEGORIES } from "../../constants/ruleDBCategories";
import type { RuleRowData } from "../../types/ruleDB";

interface RuleRowDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  keyLabel: string;
  initial?: RuleRowData;
  onClose: () => void;
  onSave: (data: RuleRowData) => void;
}

const EMPTY: RuleRowData = { key: "", category: "", lead: "" };

export function RuleRowDialog({ isOpen, mode, keyLabel, initial, onClose, onSave }: RuleRowDialogProps) {
  const [data, setData] = useState<RuleRowData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof RuleRowData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setData(initial ?? EMPTY);
      setErrors({});
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  function validate(): boolean {
    const next: Partial<Record<keyof RuleRowData, string>> = {};
    const keyErr = validateRequired(data.key);
    if (keyErr) next.key = keyErr;
    const catErr = validateRequired(data.category, "必選");
    if (catErr) next.category = catErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ key: data.key.trim(), category: data.category, lead: data.lead.trim() });
  }

  const inputCls =
    "text-sm border border-gray-200 rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-accent focus:border-transparent";

  return (
    <DialogOverlay>
      <DialogCard
        title={`${mode === "add" ? "新增" : "編輯"} ${keyLabel}`}
        onClose={onClose}
        footer={
          <>
            <button className={cardStyles.cancelButton} onClick={onClose}>取消</button>
            <button className={cardStyles.closeButton} onClick={handleSave}>儲存</button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">{keyLabel}</span>
            <input
              value={data.key}
              onChange={(e) => setData((d) => ({ ...d, key: e.target.value }))}
              className={inputCls}
            />
            {errors.key && <span className="text-xs text-red-400">{errors.key}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Category</span>
            <select
              value={data.category}
              onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))}
              className={`${inputCls} bg-white`}
            >
              <option value="">—</option>
              {RULE_DB_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className="text-xs text-red-400">{errors.category}</span>}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Lead</span>
            <input
              value={data.lead}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setData((d) => ({ ...d, lead: v }));
              }}
              placeholder="留空或輸入數字"
              inputMode="numeric"
              className={inputCls}
            />
          </label>
        </div>
      </DialogCard>
    </DialogOverlay>
  );
}
