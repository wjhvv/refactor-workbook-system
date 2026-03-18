import { useState, useCallback } from "react";

export type SortDir = "asc" | "desc";

export function useTableControls<T extends object>() {
  const [sortCol, setSortColState] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const setSort = useCallback((col: string) => {
    setSortColState((prev) => {
      if (prev !== col) {
        setSortDir("asc");
        return col;
      }
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return col;
    });
  }, []);

  const apply = useCallback(
    (rows: T[]): T[] => {
      if (!sortCol) return rows;
      return [...rows].sort((a, b) => {
        const ra = a as Record<string, unknown>;
        const rb = b as Record<string, unknown>;
        const cmp = String(ra[sortCol] ?? "").localeCompare(
          String(rb[sortCol] ?? ""),
          undefined,
          { numeric: true },
        );
        return sortDir === "asc" ? cmp : -cmp;
      });
    },
    [sortCol, sortDir],
  );

  const getSortDir = useCallback(
    (col: string): SortDir | null => (sortCol === col ? sortDir : null),
    [sortCol, sortDir],
  );

  return { setSort, apply, getSortDir };
}
