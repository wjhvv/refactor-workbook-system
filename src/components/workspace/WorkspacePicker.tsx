import { useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { PickerSearch } from "../ui/Picker";
import { ConfirmDialog } from "../ui/Dialog";
import { WorkspaceItem } from "./WorkspaceItem";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { workspacePickerStyles as s } from "./workspace.styles";
import { useDisclosure } from "../../hooks/ui/useDisclosure";
import { useClickOutside } from "../../hooks/ui/useClickOutside";
import { useDeleteConfirm } from "../../hooks/ui/useDeleteConfirm";
import { generateName } from "../../hooks/workspace/useWorkspaces";
import type { Workspace } from "../../types/workspace";

interface WorkspacePickerProps {
  workspaces: Workspace[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  getSubtitle?: (ws: Workspace) => string;
}

export function WorkspacePicker({
  workspaces,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onRemove,
  getSubtitle,
}: WorkspacePickerProps) {
  const dropdown = useDisclosure();
  const createDialog = useDisclosure();
  const deleteConfirm = useDeleteConfirm<string>();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    containerRef,
    () => {
      dropdown.close();
      setEditing(null);
    },
    dropdown.isOpen,
  );

  const activeWorkspace = workspaces.find((w) => w.id === activeId);
  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()),
  );

  function closeAndReset() {
    dropdown.close();
    setSearch("");
  }

  function handleSelect(id: string) {
    onSelect(id);
    closeAndReset();
  }

  function handleCreate() {
    closeAndReset();
    createDialog.open();
  }

  function handleCreateConfirm(name: string) {
    onCreate(name);
    createDialog.close();
  }

  function startEdit(ws: Workspace, e: React.MouseEvent) {
    e.stopPropagation();
    setEditing({ id: ws.id, name: ws.name });
  }

  function commitEdit() {
    if (editing && editing.name.trim())
      onRename(editing.id, editing.name.trim());
    setEditing(null);
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <button onClick={dropdown.toggle} className={s.trigger}>
          <span className={s.triggerLabel}>
            {activeWorkspace?.name ?? "選擇工作群組"}
          </span>
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${dropdown.isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdown.isOpen && (
          <div className={s.panel}>
            <div className={s.search}>
              <PickerSearch value={search} onChange={setSearch} />
            </div>

            <div className={s.list}>
              {filtered.length === 0 ? (
                <p className={s.empty}>無符合結果</p>
              ) : (
                filtered.map((ws) => (
                  <WorkspaceItem
                    key={ws.id}
                    workspace={ws}
                    isActive={ws.id === activeId}
                    isEditing={ws.id === editing?.id}
                    editingName={editing?.name ?? ""}
                    subtitle={getSubtitle?.(ws) ?? ""}
                    onSelect={() => handleSelect(ws.id)}
                    onEditStart={(e) => startEdit(ws, e)}
                    onEditChange={(name) =>
                      setEditing((prev) => prev && { ...prev, name })
                    }
                    onEditCommit={commitEdit}
                    onEditCancel={() => setEditing(null)}
                    onRemove={(e) => {
                      e.stopPropagation();
                      deleteConfirm.open(ws.id);
                    }}
                  />
                ))
              )}
            </div>

            <div className={s.footer}>
              <button onClick={handleCreate} className={s.footerBtn}>
                <Plus size={14} />
                新增工作群組
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="刪除工作群組"
        message={`確定要刪除「${workspaces.find((w) => w.id === deleteConfirm.pending)?.name ?? ""}」嗎？此操作無法復原。`}
        onClose={deleteConfirm.close}
        onConfirm={() => {
          if (deleteConfirm.pending) onRemove(deleteConfirm.pending);
          deleteConfirm.close();
        }}
      />

      <CreateWorkspaceDialog
        isOpen={createDialog.isOpen}
        placeholder={generateName(workspaces)}
        onClose={createDialog.close}
        onCreate={handleCreateConfirm}
      />
    </>
  );
}
