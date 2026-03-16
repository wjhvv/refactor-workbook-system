import { Search } from "lucide-react";
import { pickerStyles } from "./picker.styles";

interface PickerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PickerSearch({ value, onChange }: PickerSearchProps) {
  return (
    <div className={pickerStyles.searchRow}>
      <Search size={14} className={pickerStyles.searchIcon} />
      <input
        type="text"
        placeholder="搜尋..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={pickerStyles.searchInput}
      />
    </div>
  );
}
