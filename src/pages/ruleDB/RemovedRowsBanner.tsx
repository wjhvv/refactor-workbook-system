import { X } from "lucide-react";
import type { RemovedRow } from "../../types/ruleDB";

interface RemovedRowsBannerProps {
  rows: RemovedRow[];
  onDismiss: () => void;
}

export function RemovedRowsBanner({ rows, onDismiss }: RemovedRowsBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-medium">上傳時移除了 {rows.length} 列無效資料</span>
        <ul className="flex flex-col gap-0.5 mt-1 max-h-40 overflow-y-auto pr-1">
          {rows.map((r, i) => (
            <li key={i} className="text-xs text-amber-600">
              [{r.sheet}] 第 {r.rowIndex} 列 — {r.reason}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-400 hover:text-amber-600 transition-colors mt-0.5 cursor-pointer"
      >
        <X size={15} />
      </button>
    </div>
  );
}
