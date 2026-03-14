import { pickerStyles } from "./picker.styles";
import type { LabelValue } from "../../../types/pickerOption";

interface PickerListProps<T> {
  filtered: LabelValue<T>[];
  valueSet: Set<T>;
  onToggle: (value: T) => void;
}

export function PickerList<T>({
  filtered,
  valueSet,
  onToggle,
}: PickerListProps<T>) {
  if (filtered.length === 0) {
    return (
      <ul className={pickerStyles.optionList}>
        <li className={pickerStyles.optionEmpty}>無符合結果</li>
      </ul>
    );
  }

  return (
    <ul className={pickerStyles.optionList}>
      {filtered.map((option) => (
        <li
          key={String(option.value)}
          onClick={() => onToggle(option.value)}
          className={pickerStyles.optionItem}
        >
          <input
            type="checkbox"
            checked={valueSet.has(option.value)}
            onChange={() => onToggle(option.value)}
            className={pickerStyles.checkbox}
          />
          <span className={pickerStyles.optionLabel}>{option.label}</span>
        </li>
      ))}
    </ul>
  );
}
