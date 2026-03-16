import { panelStyles } from "./panel.styles";

export interface TogglePanelOption<T extends string> {
  value: T;
  label: string;
}

interface TogglePanelProps<T extends string> {
  label: string;
  options: TogglePanelOption<T>[];
  selected: T | null;
  onChange: (selected: T | null) => void;
}

export function TogglePanel<T extends string>({
  label,
  options,
  selected,
  onChange,
}: TogglePanelProps<T>) {
  return (
    <div className={panelStyles.container}>
      <span className={panelStyles.label}>{label}</span>
      <div className={panelStyles.toggleGroup}>
        {options.map(({ value, label: optLabel }, i) => (
          <button
            key={value}
            onClick={() => onChange(selected === value ? null : value)}
            className={panelStyles.toggleBtn(selected === value, i > 0)}
          >
            {optLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
