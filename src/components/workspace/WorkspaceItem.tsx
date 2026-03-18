import { Check, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { workspaceItemStyles as s } from "./workspace.styles";
import type { Workspace } from "../../types/workspace";

interface WorkspaceItemProps {
  workspace: Workspace;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  subtitle: string;
  onSelect: () => void;
  onEditStart: (e: React.MouseEvent) => void;
  onEditChange: (name: string) => void;
  onEditCommit: () => void;
  onEditCancel: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

export function WorkspaceItem({
  workspace,
  isActive,
  isEditing,
  editingName,
  subtitle,
  onSelect,
  onEditStart,
  onEditChange,
  onEditCommit,
  onEditCancel,
  onRemove,
}: WorkspaceItemProps) {
  return (
    <div
      onClick={() => !isEditing && onSelect()}
      className={s.row(isActive)}
    >
      <div className={s.dot(isActive)} />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editingName}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onEditCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditCommit();
              if (e.key === "Escape") onEditCancel();
            }}
            onClick={(e) => e.stopPropagation()}
            className={s.nameInput}
          />
        ) : (
          <p className={s.name}>{workspace.name}</p>
        )}
        <p className={s.meta}>
          {subtitle}
          {subtitle && " · "}
          {workspace.createdAt.slice(0, 10)}
        </p>
      </div>

      <div className={s.actions(isActive || isEditing)}>
        {isEditing ? (
          <IconButton
            icon={Check}
            variant="primary"
            size={13}
            onClick={(e) => { e.stopPropagation(); onEditCommit(); }}
          />
        ) : (
          <IconButton icon={Pencil} variant="primary" size={13} onClick={onEditStart} />
        )}
        <IconButton icon={Trash2} variant="danger" size={13} onClick={onRemove} />
      </div>
    </div>
  );
}
