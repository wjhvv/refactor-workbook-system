import { useState, useCallback } from "react";
import { parseExcel } from "../services/excel/parser";
import type { Workbook, LoadedWorkbook } from "../types/workbook";

export interface WorkbookRegistry {
  loadedWorkbooks: LoadedWorkbook[];
  activeWorkbookId: string | undefined;
  activeSheetId: string | undefined;
  addWorkbook: (file: File) => Promise<void>;
  removeWorkbook: (workbookId: string) => void;
  switchWorkbook: (workbookId: string) => void;
  switchSheet: (sheetId: string) => void;
}

export function useWorkbookRegistry(): WorkbookRegistry {
  const [loadedWorkbooks, setLoadedWorkbooks] = useState<LoadedWorkbook[]>([]);
  const [activeWorkbookId, setActiveWorkbookId] = useState<
    string | undefined
  >();
  const [activeSheetId, setActiveSheetId] = useState<string | undefined>();

  const addWorkbook = useCallback(async (file: File) => {
    const parsed = await parseExcel(file);
    const id = crypto.randomUUID();
    const descriptor: Workbook = {
      id,
      name: file.name.replace(/\.[^/.]+$/, ""),
      sheets: parsed.sheets.map((s) => ({ id: s.name, name: s.name })),
    };
    const loaded: LoadedWorkbook = { descriptor, parsed };

    setLoadedWorkbooks((prev) => [...prev, loaded]);
    setActiveWorkbookId(id);
    setActiveSheetId(parsed.sheets[0]?.name);
  }, []);

  const removeWorkbook = useCallback(
    (workbookId: string) => {
      setLoadedWorkbooks((prev) => {
        const next = prev.filter((lw) => lw.descriptor.id !== workbookId);
        if (activeWorkbookId === workbookId) {
          const removed = prev.findIndex(
            (lw) => lw.descriptor.id === workbookId,
          );
          const fallback = next[removed - 1] ?? next[removed] ?? next[0];
          setActiveWorkbookId(fallback?.descriptor.id);
          setActiveSheetId(fallback?.parsed.sheets[0]?.name);
        }
        return next;
      });
    },
    [activeWorkbookId],
  );

  const switchWorkbook = useCallback((workbookId: string) => {
    setActiveWorkbookId(workbookId);
    setLoadedWorkbooks((prev) => {
      const target = prev.find((lw) => lw.descriptor.id === workbookId);
      setActiveSheetId(target?.parsed.sheets[0]?.name);
      return prev;
    });
  }, []);

  const switchSheet = useCallback((sheetId: string) => {
    setActiveSheetId(sheetId);
  }, []);

  return {
    loadedWorkbooks,
    activeWorkbookId,
    activeSheetId,
    addWorkbook,
    removeWorkbook,
    switchWorkbook,
    switchSheet,
  };
}
