import type { CellDef, ValidationResult } from "../types/displayTable";

export function validateCell(
  cell: CellDef,
  value: string | number | null,
): ValidationResult {
  const { validation } = cell;
  if (!validation) return { valid: true };

  const isEmpty = value === null || value === "";
  if (isEmpty) {
    if (validation.required) {
      return { valid: false, message: validation.message ?? "此欄位為必填" };
    }
    return { valid: true };
  }

  switch (validation.type) {
    case "number": {
      const num = Number(value);
      if (isNaN(num))
        return { valid: false, message: validation.message ?? "請輸入數字" };

      if (validation.min !== undefined && num < validation.min)
        return {
          valid: false,
          message: validation.message ?? `最小值為 ${validation.min}`,
        };

      if (validation.max !== undefined && num > validation.max)
        return {
          valid: false,
          message: validation.message ?? `最大值為 ${validation.max}`,
        };
      break;
    }

    case "select": {
      if (validation.options && !validation.options.includes(String(value))) {
        return {
          valid: false,
          message: validation.message ?? "請選擇有效的選項",
        };
      }
      break;
    }
  }

  return { valid: true };
}
