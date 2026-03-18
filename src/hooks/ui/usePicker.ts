import { useState, useMemo, useCallback } from "react";
import type { LabelValue } from "../../types/pickerOption";

export function usePicker<T = string>(
  options: LabelValue<T>[],
  selected: T[],
  onChange: (selected: T[]) => void,
) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        String(o.label).toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  const valueSet = useMemo(() => new Set(selected), [selected]);

  const clearFiltered = useCallback(() => {
    const filteredSet = new Set(filtered.map((o) => o.value));
    onChange(selected.filter((v) => !filteredSet.has(v)));
  }, [filtered, selected, onChange]);

  const toggleAll = useCallback(() => {
    const allSelected =
      filtered.length > 0 && filtered.every((o) => valueSet.has(o.value));
    if (allSelected) {
      clearFiltered();
    } else {
      onChange([
        ...selected,
        ...filtered.map((o) => o.value).filter((v) => !valueSet.has(v)),
      ]);
    }
  }, [clearFiltered, filtered, selected, valueSet, onChange]);

  const toggleOne = useCallback(
    (val: T) => {
      if (valueSet.has(val)) {
        onChange(selected.filter((v) => v !== val));
      } else {
        onChange([...selected, val]);
      }
    },
    [selected, valueSet, onChange],
  );

  return {
    search,
    setSearch,
    filtered,
    valueSet,
    toggleOne,
    toggleAll,
    clearFiltered,
  };
}
