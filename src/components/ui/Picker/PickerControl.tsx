import { pickerStyles } from "./picker.styles";

interface PickerControlProps {
  onSelectAll: () => void;
  onClear: () => void;
}

export function PickerControl({ onSelectAll, onClear }: PickerControlProps) {
  return (
    <div className={pickerStyles.controlRow}>
      <button onClick={onSelectAll} className={pickerStyles.controlSelectAll}>
        All
      </button>
      <button onClick={onClear} className={pickerStyles.controlClear}>
        None
      </button>
    </div>
  );
}
