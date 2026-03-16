import { useRef } from "react";
import type { Workbook } from "../../types/workbook";
import { Trash2, Download, Plus } from "lucide-react";
import { tabStyles } from "./workbook.styles";
import { IconButton } from "../ui/IconButton";

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAddWorkbook(files);
    e.target.value = "";
  }

  return (
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
                onClick={() => onWorkbookRemove(workbook.id)}
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
  );
}
