export function normalizeText(value: string | number | null): string | null {
  if (typeof value !== "string") return null;
  return value.trim().toLowerCase();
}

export function cellValueToLabel(
  value: string | number | null,
  fallback: string,
): string {
  if (typeof value === "string") return value;
  if (value !== null) return String(value);
  return fallback;
}

export function findByAlias<T extends { aliases: string[] }>(
  value: string | number | null,
  groups: T[],
): T | undefined {
  const text = normalizeText(value);
  if (text === null) return undefined;
  return groups.find((group) =>
    group.aliases.some((alias) => alias.toLowerCase() === text),
  );
}
