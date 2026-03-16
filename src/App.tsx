import { useMemo, useCallback } from "react";
import { WorkbookShell } from "./components/workbook/WorkbookShell";
import { UploadZone } from "./components/ui/UploadZone";
import { SplittedTable } from "./components/table/SplittedTable";
import { useWorkbookRegistry } from "./hooks/useWorkbookRegistry";
import { useSheetHeader } from "./hooks/useSheetHeader";
import { useSheetSplit } from "./hooks/useSheetSplit";
import { downloadWorkbook } from "./services/excel/writer";
import { buildDownloadWorksheets } from "./services/excel/downloadBuilder";

export default function App() {
  const registry = useWorkbookRegistry();
  const { loadedWorkbooks, activeWorkbookId, activeSheetId } = registry;

  const tableStates = useSheetHeader(loadedWorkbooks);

  const headerMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tableStates).map(([wbId, sheetStates]) => [
          wbId,
          Object.fromEntries(
            Object.entries(sheetStates).map(([name, s]) => [name, s.headerRowIndex]),
          ),
        ]),
      ),
    [tableStates],
  );

  const splitStates = useSheetSplit(loadedWorkbooks, headerMap);

  const handleDownload = useCallback(
    (workbookId: string) => {
      const lw = loadedWorkbooks.find((w) => w.descriptor.id === workbookId);
      if (!lw) return;

      const worksheets = buildDownloadWorksheets(
        lw,
        tableStates[workbookId] ?? {},
        splitStates[workbookId] ?? {},
      );
      if (worksheets.length === 0) return;

      downloadWorkbook(worksheets, `${lw.descriptor.name}.xlsx`);
    },
    [loadedWorkbooks, tableStates, splitStates],
  );

  const workbookDescriptors = loadedWorkbooks.map((lw) => lw.descriptor);

  return (
    <div className="flex flex-col h-screen">
      {loadedWorkbooks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <UploadZone
              onUpload={(files) => files.forEach((f) => registry.addWorkbook(f))}
              accept=".xlsx,.xls,.csv"
              multiple
              hint="Supports .xlsx, .xls, .csv"
            />
          </div>
        </div>
      ) : (
        <WorkbookShell
          workbooks={workbookDescriptors}
          activeWorkbookId={activeWorkbookId}
          activeSheetId={activeSheetId}
          onWorkbookChange={registry.switchWorkbook}
          onWorkbookRemove={registry.removeWorkbook}
          onWorkbookDownload={handleDownload}
          onAddWorkbook={(files) => files.forEach((f) => registry.addWorkbook(f))}
          onSheetChange={registry.switchSheet}
        >
          {(workbookId, sheetId) => {
            const lw = loadedWorkbooks.find((w) => w.descriptor.id === workbookId);
            const sheet = lw?.parsed.sheets.find((s) => s.name === sheetId);
            const tableState = tableStates[workbookId]?.[sheetId];
            const splitState = splitStates[workbookId]?.[sheetId];
            if (!sheet || !tableState || !splitState) return null;
            return (
              <SplittedTable sheet={sheet} tableState={tableState} splitState={splitState} />
            );
          }}
        </WorkbookShell>
      )}
    </div>
  );
}
