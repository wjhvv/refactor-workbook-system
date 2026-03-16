export function cellValueToLabel(
  value: string | number | null,
  fallback: string,
): string {
  if (typeof value === "string") return value;
  if (value !== null) return String(value);
  return fallback;
}
