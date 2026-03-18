import { useWorkbookRegistry } from "../../hooks/workbook/useWorkbookRegistry";
import { WorkbookShell } from "./WorkbookShell";
import { SheetPreview } from "../table/SheetPreview";
import { UploadZone } from "../ui/UploadZone";
import { EmptyState } from "../ui/EmptyState";
import { useWorkbookExport } from "../../hooks/workbook/useWorkbookExport";

export function WorkbookUploadView() {
  const registry = useWorkbookRegistry();
  const { loadedWorkbooks, activeWorkbookId, activeSheetId } = registry;
  const { downloadOne } = useWorkbookExport(loadedWorkbooks, {}, {});

  const workbookDescriptors = loadedWorkbooks.map((lw) => lw.descriptor);

  if (loadedWorkbooks.length === 0) {
    return (
      <EmptyState centered>
        <UploadZone
          onUpload={(files) => files.forEach(registry.addWorkbook)}
          accept=".xlsx,.xls,.csv"
          multiple
          hint="Supports .xlsx, .xls, .csv"
        />
      </EmptyState>
    );
  }

  return (
    <WorkbookShell
      workbooks={workbookDescriptors}
      activeWorkbookId={activeWorkbookId}
      activeSheetId={activeSheetId}
      onWorkbookChange={registry.switchWorkbook}
      onWorkbookRemove={registry.removeWorkbook}
      onWorkbookDownload={downloadOne}
      onAddWorkbook={(files) => files.forEach(registry.addWorkbook)}
      onSheetChange={registry.switchSheet}
    >
      {(workbookId, sheetId) => {
        const lw = loadedWorkbooks.find((w) => w.descriptor.id === workbookId);
        const sheet = lw?.parsed.sheets.find((s) => s.name === sheetId);
        if (!sheet) return null;
        return <SheetPreview sheet={sheet} />;
      }}
    </WorkbookShell>
  );
}
