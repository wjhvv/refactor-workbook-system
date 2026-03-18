import { useRef } from "react";
import { CloudUpload } from "lucide-react";
import { filterFilesByAccept } from "../../utils/file";
import { useFileDropZone } from "../../hooks/ui/useFileDropZone";

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  browseLabel?: string;
  hint?: string;
}

const baseClass =
  "w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl px-8 py-16 cursor-pointer transition-colors";

const uploadZoneStyles = {
  idle: `${baseClass} border-[var(--accent-border)] bg-white hover:bg-[var(--accent-bg)]`,
  dragging: `${baseClass} border-[var(--accent)] bg-[var(--accent-bg)]`,
};

export function UploadZone({
  onUpload,
  accept,
  multiple = false,
  label = "Drag & drop files here, or",
  browseLabel = "click to browse",
  hint,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const result = accept
      ? filterFilesByAccept(Array.from(files), accept)
      : Array.from(files);
    if (result.length === 0) return;
    onUpload(result);
  }

  const { isDragging, dragProps } = useFileDropZone((files) =>
    handleFiles(files),
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      {...dragProps}
      className={isDragging ? uploadZoneStyles.dragging : uploadZoneStyles.idle}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <CloudUpload size={30} strokeWidth={1.5} className="text-gray-400" />
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          {label} <span className="text-(--accent)">{browseLabel}</span>
        </p>
        {hint && (
          <span className="block text-xs text-gray-400 mt-1">{hint}</span>
        )}
      </div>
    </div>
  );
}
