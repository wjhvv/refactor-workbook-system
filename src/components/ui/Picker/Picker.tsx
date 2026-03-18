import { usePicker } from "../../../hooks/ui/usePicker";
import { pickerStyles } from "./picker.styles";
import { PickerSearch } from "./PickerSearch";
import { PickerControl } from "./PickerControl";
import { PickerList } from "./PickerList";
import type { LabelValue } from "../../../types/pickerOption";

interface PickerProps<T = string> {
  options: LabelValue<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export function Picker<T = string>({
  options,
  selected,
  onChange,
}: PickerProps<T>) {
  const {
    search,
    setSearch,
    filtered,
    valueSet,
    toggleOne,
    toggleAll,
    clearFiltered,
  } = usePicker(options, selected, onChange);

  return (
    <div className={pickerStyles.base}>
      <PickerSearch value={search} onChange={setSearch} />
      <PickerControl onSelectAll={toggleAll} onClear={clearFiltered} />
      <PickerList
        filtered={filtered}
        valueSet={valueSet}
        onToggle={toggleOne}
      />
    </div>
  );
}
