export function validateRequired(value: string, message = "必填"): string | null {
  return value.trim() ? null : message;
}

export function validateUnique(
  value: string,
  existing: string[],
  message = "已存在相同項目",
): string | null {
  const lower = value.toLowerCase();
  return existing.some((e) => e.toLowerCase() === lower) ? message : null;
}
