import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { IconButton } from "../../components/ui/IconButton";
import { ConfirmDialog } from "../../components/ui/Dialog";
import { VirtualTable } from "../../components/table/VirtualTable";
import type { VirtualTableColumn } from "../../components/table/VirtualTable";
import { useTableControls } from "../../hooks/ui/useTableControls";
import { useDeleteConfirm } from "../../hooks/ui/useDeleteConfirm";
import { RuleRowDialog } from "./RuleRowDialog";
import type { RuleRowData } from "../../types/ruleDB";

interface RuleDataTableProps {
  keyLabel: string;
  rows: RuleRowData[];
  onAdd: (data: RuleRowData) => void;
  onUpdate: (index: number, data: RuleRowData) => void;
  onDelete: (index: number) => void;
}

type EditDialog = { mode: "add" } | { mode: "edit"; index: number; initial: RuleRowData } | null;

export function RuleDataTable({ keyLabel, rows, onAdd, onUpdate, onDelete }: RuleDataTableProps) {
  const [dialog, setDialog] = useState<EditDialog>(null);
  const deleteConfirm = useDeleteConfirm<number>();
  const controls = useTableControls<RuleRowData>();
  const displayRows = controls.apply(rows);

  function handleSave(data: RuleRowData) {
    if (!dialog) return;
    if (dialog.mode === "add") onAdd(data);
    else onUpdate(dialog.index, data);
    setDialog(null);
  }

  const columns: VirtualTableColumn<RuleRowData>[] = [
    { key: "key", label: keyLabel, width: 200, renderCell: (row) => row.key || "—" },
    {
      key: "category",
      label: "Category",
      width: 144,
      sortDir: controls.getSortDir("category"),
      onSort: () => controls.setSort("category"),
      renderCell: (row) => row.category || "—",
    },
    { key: "lead", label: "Lead", width: 80, renderCell: (row) => row.lead || "—" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <VirtualTable<RuleRowData>
        rows={displayRows}
        columns={columns}
        getRowKey={(row) => row.key + row.category}
        renderRowActions={(row) => {
          const originalIndex = rows.indexOf(row);
          return (
            <>
              <IconButton
                variant="primary"
                icon={Pencil}
                size={13}
                onClick={() => setDialog({ mode: "edit", index: originalIndex, initial: row })}
              />
              <IconButton
                variant="danger"
                icon={Trash2}
                size={13}
                onClick={() => deleteConfirm.open(originalIndex)}
              />
            </>
          );
        }}
        footer={
          <button
            onClick={() => setDialog({ mode: "add" })}
            className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-gray-300 hover:text-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            新增
          </button>
        }
        emptyMessage="無資料"
      />

      <RuleRowDialog
        isOpen={dialog !== null}
        mode={dialog?.mode ?? "add"}
        keyLabel={keyLabel}
        initial={dialog?.mode === "edit" ? dialog.initial : undefined}
        onClose={() => setDialog(null)}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`刪除 ${keyLabel}`}
        message={deleteConfirm.pending !== null ? `確定要刪除「${rows[deleteConfirm.pending]?.key}」嗎？` : undefined}
        onClose={deleteConfirm.close}
        onConfirm={() => {
          if (deleteConfirm.pending !== null) onDelete(deleteConfirm.pending);
          deleteConfirm.close();
        }}
      />
    </div>
  );
}
