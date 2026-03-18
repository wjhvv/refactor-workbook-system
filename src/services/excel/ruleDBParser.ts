import type { ParsedWorkbook, ParsedSheet, ParsedCell, ParsedCellMap } from "../../types/excel";
import type { HeaderField, PartNumberRule, DescriptionRule, RuleDatabase, RemovedRow } from "../../types/ruleDB";
import { isValidCategory, isValidLead } from "../../constants/ruleDBCategories";

const REQUIRED_SHEETS = ["header", "partnumber", "description"] as const;

function cellStr(cell: ParsedCell | undefined): string {
  return String(cell?.value ?? "").trim();
}

function sortedColKeys(cells: ParsedCellMap): string[] {
  return Object.keys(cells).sort((a, b) => Number(a) - Number(b));
}

function findColKey(cells: ParsedCellMap, name: string): string {
  for (const [key, cell] of Object.entries(cells)) {
    if (cellStr(cell).toLowerCase() === name.toLowerCase()) return key;
  }
  return "";
}

function parseHeaderSheet(sheet: ParsedSheet): HeaderField[] {
  if (sheet.rows.length === 0) return [];
  const headerRow = sheet.rows[0];
  const colKeys = sortedColKeys(headerRow.cells);

  return colKeys
    .map((colKey) => {
      const name = cellStr(headerRow.cells[colKey]);
      if (!name) return null;
      const aliases = sheet.rows
        .slice(1)
        .map((row) => cellStr(row.cells[colKey]))
        .filter(Boolean);
      return { name, aliases };
    })
    .filter((f): f is HeaderField => f !== null);
}

function parseRuleSheet(
  sheet: ParsedSheet,
  keyColName: string,
  sheetName: "partnumber" | "description",
): { rows: { key: string; category: string; lead: string }[]; removed: RemovedRow[] } {
  if (sheet.rows.length < 2) return { rows: [], removed: [] };
  const header = sheet.rows[0].cells;
  const keyCol = findColKey(header, keyColName);
  const catCol = findColKey(header, "category");
  const leadCol = findColKey(header, "lead");

  const rows: { key: string; category: string; lead: string }[] = [];
  const removed: RemovedRow[] = [];

  for (const r of sheet.rows.slice(1).filter((r) => !r.hidden)) {
    const key = cellStr(r.cells[keyCol]);
    if (!key) continue;
    const category = cellStr(r.cells[catCol]);
    const lead = cellStr(r.cells[leadCol]);

    if (!isValidCategory(category)) {
      removed.push({ sheet: sheetName, rowIndex: r.index, value: key, reason: `無效類別「${category}」` });
      continue;
    }
    if (!isValidLead(lead)) {
      removed.push({ sheet: sheetName, rowIndex: r.index, value: key, reason: `Lead 非數字「${lead}」` });
      continue;
    }
    rows.push({ key, category, lead });
  }

  return { rows, removed };
}

export function parseRuleDB(workbook: ParsedWorkbook): RuleDatabase {
  const sheetMap = Object.fromEntries(
    workbook.sheets.map((s) => [s.name.toLowerCase(), s]),
  );

  const missing = REQUIRED_SHEETS.filter((name) => !sheetMap[name]);
  if (missing.length > 0) {
    throw new Error(`缺少必要的工作表：${missing.join("、")}`);
  }

  const pn = parseRuleSheet(sheetMap["partnumber"], "partnumber", "partnumber");
  const desc = parseRuleSheet(sheetMap["description"], "description", "description");

  return {
    headerFields: parseHeaderSheet(sheetMap["header"]),
    partNumbers: pn.rows.map((r) => ({ partNumber: r.key, category: r.category, lead: r.lead } as PartNumberRule)),
    descriptions: desc.rows.map((r) => ({ description: r.key, category: r.category, lead: r.lead } as DescriptionRule)),
    partNumberSheet: sheetMap["partnumber"],
    descriptionSheet: sheetMap["description"],
    removedRows: [...pn.removed, ...desc.removed],
  };
}
