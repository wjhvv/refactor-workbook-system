import type { ParsedSheet, ParsedRow } from "../../types/excel";
import type {
  ColumnDef,
  HeaderCandidateGroup,
  HeaderDetectionResult,
} from "../../types/displayTable";
import { HEADER_DETECTION_STATUS } from "../../types/displayTable";
import { findByAlias, cellValueToLabel } from "../../utils/text";

type FieldColKeyMap = Record<string, string>; // field name → colKey，只存命中的欄位
type ColKeyFieldMap = Record<string, string>; // colKey → field name，反轉自 FieldColKeyMap

// ─── 內部小工具 ────────────────────────────────────────────────

/** 掃描一列的所有 cell，找出哪些格子的文字符合 candidates 的 aliases，
 *  回傳 field → colKey 的對應表 */
function computeFieldColKeyMap(
  row: ParsedRow,
  candidates: HeaderCandidateGroup[],
): FieldColKeyMap {
  const result: FieldColKeyMap = {};
  for (const [colKey, cell] of Object.entries(row.cells)) {
    const field = findByAlias(cell.value, candidates)?.field;
    if (field !== undefined) result[field] = colKey;
  }
  return result;
}

/** FieldColKeyMap 非空代表這列有匹配到至少一個 candidate */
function hasFieldMatch(fieldMap: FieldColKeyMap): boolean {
  return Object.keys(fieldMap).length > 0;
}

/** FieldColKeyMap 是 field→colKey，buildColumns 需要 colKey→field，先做一次反轉 */
function invertFieldColKeyMap(fieldMap: FieldColKeyMap): ColKeyFieldMap {
  return Object.fromEntries(
    Object.entries(fieldMap).map(([field, colKey]) => [colKey, field]),
  );
}

/** Excel 位址（如 "B3"）末尾的數字就是 row index */
function extractRowIndex(address: string): number | null {
  const match = address.match(/\d+$/);
  return match ? parseInt(match[0], 10) : null;
}

// ─── 組裝 columns ──────────────────────────────────────────────

/** 把 header 列的每個 cell 轉成 ColumnDef，順便標上匹配到的 field */
function buildColumns(
  sheet: ParsedSheet,
  headerRow: ParsedRow,
  fieldMap: FieldColKeyMap,
): ColumnDef[] {
  const colKeyToField = invertFieldColKeyMap(fieldMap);

  return Object.entries(headerRow.cells)
    .filter(([, cell]) => !cell.isMergedChild)
    .map(([colKey, cell]) => {
      const colDef = sheet.columns.find((c) => String(c.index) === colKey);
      return {
        key: colKey,
        field: colKeyToField[colKey],
        label: cellValueToLabel(cell.value, colKey),
        width: colDef?.width,
        hidden: colDef?.hidden ?? false,
      };
    });
}

// ─── 對外 API ──────────────────────────────────────────────────

/** 自動偵測：掃描所有列，找出符合 candidates 的 header 列
 *  - 唯一命中 → found
 *  - 多列命中 → ambiguous（讓 UI 請使用者選）
 *  - 無命中   → not_found */
export function detectHeaderByCandidates(
  sheet: ParsedSheet,
  candidates: HeaderCandidateGroup[],
): HeaderDetectionResult {
  const matchingRows = sheet.rows
    .map((row) => ({ row, fieldMap: computeFieldColKeyMap(row, candidates) }))
    .filter(({ fieldMap }) => hasFieldMatch(fieldMap));

  if (matchingRows.length === 0)
    return { status: HEADER_DETECTION_STATUS.NotFound };

  if (matchingRows.length > 1)
    return {
      status: HEADER_DETECTION_STATUS.Ambiguous,
      candidates: matchingRows.map((m) => m.row.index),
    };

  const { row, fieldMap } = matchingRows[0];
  return {
    status: HEADER_DETECTION_STATUS.Found,
    headerRowIndex: row.index,
    columns: buildColumns(sheet, row, fieldMap),
  };
}

/** 手動偵測：使用者自行點選 header 格子，驗證是否都在同一列 */
export function detectHeaderBySelection(
  sheet: ParsedSheet,
  selectedAddresses: string[],
  candidates: HeaderCandidateGroup[] = [],
): HeaderDetectionResult {
  const rowIndexes = selectedAddresses.map(extractRowIndex);
  const uniqueRows = [...new Set(rowIndexes.filter((r) => r !== null))];

  // 選取的格子不在同一列，無法判斷 header
  if (uniqueRows.length !== 1)
    return { status: HEADER_DETECTION_STATUS.NotFound };

  const headerRowIndex = uniqueRows[0]!;
  const headerRow = sheet.rows.find((r) => r.index === headerRowIndex);
  const fieldMap = headerRow
    ? computeFieldColKeyMap(headerRow, candidates)
    : {};

  return {
    status: HEADER_DETECTION_STATUS.Found,
    headerRowIndex,
    columns: headerRow ? buildColumns(sheet, headerRow, fieldMap) : [],
  };
}
