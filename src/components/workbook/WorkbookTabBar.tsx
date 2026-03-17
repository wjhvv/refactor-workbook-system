import { useRef, useState } from "react";
import type { Workbook } from "../../types/workbook";
import { Trash2, Download, Plus } from "lucide-react";
import { tabStyles } from "./workbook.styles";
import { IconButton } from "../ui/IconButton";
import { ConfirmDialog } from "../ui/Dialog/ConfirmCard";
import { useDisclosure } from "../../hooks/useDisclosure";

interface WorkbookTabBarProps {
  workbooks: Workbook[];
  activeWorkbookId: string | undefined;
  onWorkbookChange: (workbookId: string) => void;
  onWorkbookRemove: (workbookId: string) => void;
  onWorkbookDownload: (workbookId: string) => void;
  onAddWorkbook: (files: File[]) => void;
}

export function WorkbookTabBar({
  workbooks,
  activeWorkbookId,
  onWorkbookChange,
  onWorkbookRemove,
  onWorkbookDownload,
  onAddWorkbook,
}: WorkbookTabBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const confirm = useDisclosure();
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAddWorkbook(files);
    e.target.value = "";
  }

  function requestRemove(workbookId: string) {
    setPendingRemoveId(workbookId);
    confirm.open();
  }

  function handleConfirmRemove() {
    if (pendingRemoveId) onWorkbookRemove(pendingRemoveId);
    confirm.close();
    setPendingRemoveId(null);
  }

  function handleCancelRemove() {
    confirm.close();
    setPendingRemoveId(null);
  }

  const pendingWorkbook = workbooks.find((w) => w.id === pendingRemoveId);

  return (
    <>
      <div className="flex items-end border-b border-gray-200 overflow-x-auto">
        {workbooks.map((workbook) => {
          const isActive = workbook.id === activeWorkbookId;
          return (
            <button
              key={workbook.id}
              onClick={() => onWorkbookChange(workbook.id)}
              className={`group ${isActive ? tabStyles.active : tabStyles.inactive}`}
            >
              <span className="max-w-36 truncate font-bold">{workbook.name}</span>
              <div className="flex items-center gap-2">
                <IconButton
                  icon={Download}
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkbookDownload(workbook.id);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    requestRemove(workbook.id);
                  }}
                />
              </div>
            </button>
          );
        })}

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        <span className="self-center ml-2">
          <IconButton
            icon={Plus}
            size={18}
            onClick={() => inputRef.current?.click()}
          />
        </span>
      </div>

      <ConfirmDialog
        isOpen={confirm.isOpen}
        title="刪除 Workbook"
        message={`確定要刪除「${pendingWorkbook?.name ?? ""}」嗎？此操作無法復原。`}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
