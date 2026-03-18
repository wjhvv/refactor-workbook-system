import { useRef } from "react";
import { Database, Upload, Trash2 } from "lucide-react";
import { IconButton } from "../../components/ui/IconButton";
import { ConfirmDialog } from "../../components/ui/Dialog";
import { useDisclosure } from "../../hooks/ui/useDisclosure";

interface RuleDBFileBarProps {
  fileName: string;
  fileSize: number;
  sheetCount: number;
  onReplace: (file: File) => void;
  onClear: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RuleDBFileBar({ fileName, fileSize, sheetCount, onReplace, onClear }: RuleDBFileBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const confirm = useDisclosure();

  return (
    <>
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-light text-accent shrink-0">
          <Database size={18} />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-700 truncate">{fileName}</span>
          <span className="text-xs text-gray-400">
            {formatBytes(fileSize)} · {sheetCount} 個工作表
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-accent hover:text-accent transition-colors cursor-pointer"
          >
            <Upload size={13} />
            更換檔案
          </button>
          <IconButton variant="danger" icon={Trash2} onClick={confirm.open} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onReplace(file);
          e.target.value = "";
        }}
      />

      <ConfirmDialog
        isOpen={confirm.isOpen}
        title="移除 Rule Database"
        message={`確定要移除「${fileName}」嗎？所有編輯中的資料都會消失。`}
        onClose={confirm.close}
        onConfirm={() => { onClear(); confirm.close(); }}
      />
    </>
  );
}
