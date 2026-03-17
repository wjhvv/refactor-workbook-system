import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getGroupColor } from "../constants/groupColors";
import { GroupPainterDropdown } from "../components/ui/Dropdown";
import { GroupPill, ReadOnlyPill } from "../components/ui/GroupPill";
import { getMaxGroupNumber } from "../utils/groupUtils";

interface UseRowGroupPainterOptions {
  rowGroupMap: Record<number, number>;
  maxGroup: number;
  onPaintRows: (indices: number[], groupNum: number) => void;
  dataRowIndices: number[];
  readOnly?: boolean;
}

export interface RowGroupPainter {
  renderLeadingCell: (rowIndex: number) => React.ReactNode;
  getRowClass: (rowIndex: number) => string | undefined;
  getCellClass: (
    rowIndex: number,
    colKey: string,
    value: unknown,
  ) => string | undefined;
  dropdownEl: React.ReactNode;
  isDraggingRef: React.RefObject<boolean | null>;
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function canAddGroupToSelection(
  selection: number[],
  rowGroupMap: Record<number, number>,
): boolean {
  const groupSizes: Record<number, number> = {};
  for (const g of Object.values(rowGroupMap))
    groupSizes[g] = (groupSizes[g] ?? 0) + 1;

  const selectedGroupCounts: Record<number, number> = {};
  for (const idx of selection) {
    const g = rowGroupMap[idx];
    if (g) selectedGroupCounts[g] = (selectedGroupCounts[g] ?? 0) + 1;
  }

  return !Object.entries(selectedGroupCounts).some(
    ([g, count]) => count === groupSizes[Number(g)],
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useRowGroupPainter({
  rowGroupMap,
  maxGroup,
  onPaintRows,
  dataRowIndices,
  readOnly = false,
}: UseRowGroupPainterOptions): RowGroupPainter {
  const [selection, setSelection] = useState<number[]>([]);
  const [dropdownPos, setDropdownPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const isDraggingRef = useRef(false);
  const dragAnchorRef = useRef<number | null>(null);
  const dragModeRef = useRef<"assign" | "clear">("assign");
  const selectionRef = useRef<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rowGroupMapRef = useRef(rowGroupMap);
  const onPaintRowsRef = useRef(onPaintRows);
  const dataRowIndicesRef = useRef(dataRowIndices);

  selectionRef.current = selection;
  rowGroupMapRef.current = rowGroupMap;
  onPaintRowsRef.current = onPaintRows;
  dataRowIndicesRef.current = dataRowIndices;

  const selectionSet = useMemo(() => new Set(selection), [selection]);
  const dataRowSet = useMemo(() => new Set(dataRowIndices), [dataRowIndices]);

  const getRange = useCallback((anchor: number, current: number): number[] => {
    const all = dataRowIndicesRef.current;
    const a = all.indexOf(anchor);
    const b = all.indexOf(current);
    if (a === -1 || b === -1) return [anchor];
    const [s, e] = a <= b ? [a, b] : [b, a];
    return all.slice(s, e + 1);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownPos(null);
    setSelection([]);
  }, []);

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const sel = selectionRef.current;
      if (sel.length === 0) return;

      const isSingleClick =
        sel.length === 1 && sel[0] === dragAnchorRef.current;
      const mode = dragModeRef.current;

      if (mode === "clear" && isSingleClick) {
        setDropdownPos({ x: e.clientX + 10, y: e.clientY - 10 });
      } else if (mode === "clear") {
        onPaintRowsRef.current(sel, 0);
        setSelection([]);
      } else {
        onPaintRowsRef.current(
          sel,
          getMaxGroupNumber(rowGroupMapRef.current) + 1,
        );
        setSelection([]);
      }
    }
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    if (!dropdownPos) return;
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownPos, closeDropdown]);

  const handlePillMouseDown = useCallback(
    (e: React.MouseEvent, rowIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragAnchorRef.current = rowIndex;
      dragModeRef.current =
        rowGroupMapRef.current[rowIndex] != null ? "clear" : "assign";
      setSelection([rowIndex]);
      setDropdownPos(null);
    },
    [],
  );

  const handlePillMouseEnter = useCallback(
    (rowIndex: number) => {
      if (!isDraggingRef.current || dragAnchorRef.current === null) return;
      setSelection(getRange(dragAnchorRef.current, rowIndex));
    },
    [getRange],
  );

  const assignGroup = useCallback(
    (groupNum: number) => {
      onPaintRowsRef.current(selectionRef.current, groupNum);
      closeDropdown();
    },
    [closeDropdown],
  );

  const renderLeadingCell = useCallback(
    (rowIndex: number): React.ReactNode => {
      const groupNum = rowGroupMap[rowIndex] ?? 0;
      if (readOnly) return <ReadOnlyPill groupNum={groupNum} />;
      return (
        <GroupPill
          rowIndex={rowIndex}
          groupNum={groupNum}
          isSelected={selectionSet.has(rowIndex)}
          isClearMode={dragModeRef.current === "clear"}
          onMouseDown={handlePillMouseDown}
          onMouseEnter={handlePillMouseEnter}
        />
      );
    },
    [
      rowGroupMap,
      readOnly,
      selectionSet,
      handlePillMouseDown,
      handlePillMouseEnter,
    ],
  );

  const getRowClass = useCallback(
    (rowIndex: number): string | undefined => {
      if (selectionSet.has(rowIndex)) {
        return dragModeRef.current === "clear"
          ? "border-b border-gray-200 bg-white opacity-40"
          : "border-b border-blue-200 bg-blue-50";
      }
      if (!dataRowSet.has(rowIndex)) return undefined;
      const groupNum = rowGroupMap[rowIndex] ?? 0;
      return groupNum > 0 ? getGroupColor(groupNum).row : undefined;
    },
    [selectionSet, dataRowSet, rowGroupMap],
  );

  const getCellClass = useCallback(
    (
      rowIndex: number,
      _colKey: string,
      _value: unknown,
    ): string | undefined => {
      if (selectionSet.has(rowIndex) || !dataRowSet.has(rowIndex))
        return undefined;
      const groupNum = rowGroupMap[rowIndex] ?? 0;
      if (groupNum <= 0) return undefined;
      return `px-3 py-1.5 whitespace-nowrap ${getGroupColor(groupNum).cell}`;
    },
    [selectionSet, dataRowSet, rowGroupMap],
  );

  const dropdownEl = useMemo(() => {
    if (!dropdownPos) return null;

    const currentGroup =
      selection.length === 1 ? (rowGroupMap[selection[0]] ?? 0) : null;
    const canAddGroup = canAddGroupToSelection(selection, rowGroupMap);

    return (
      <GroupPainterDropdown
        style={{ position: "fixed", left: dropdownPos.x, top: dropdownPos.y }}
        dropdownRef={dropdownRef}
        maxGroup={maxGroup}
        currentGroup={currentGroup}
        canAddGroup={canAddGroup}
        hasAssigned={selection.some((idx) => rowGroupMap[idx])}
        onAssign={assignGroup}
        onClose={closeDropdown}
      />
    );
  }, [
    dropdownPos,
    selection,
    rowGroupMap,
    maxGroup,
    assignGroup,
    closeDropdown,
  ]);

  return {
    renderLeadingCell,
    getRowClass,
    getCellClass,
    dropdownEl,
    isDraggingRef,
  };
}
