// 在這裡定義所有合法的 Rule DB 類別
// 上傳的 Excel 若包含不在此清單中的類別，該列將被自動移除
export const RULE_DB_CATEGORIES = [
  "電子",
  "機械",
  "軟體",
  "服務",
  "其他",
] as const;

export type RuleDBCategory = (typeof RULE_DB_CATEGORIES)[number];

export function isValidCategory(value: string): boolean {
  return (
    value === "" || (RULE_DB_CATEGORIES as readonly string[]).includes(value)
  );
}

export function isValidLead(value: string): boolean {
  return value === "" || !isNaN(Number(value));
}
