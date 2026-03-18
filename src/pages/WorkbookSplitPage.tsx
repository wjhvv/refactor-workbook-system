import { Layers, ArchiveIcon } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { WorkbookShell } from "../components/workbook/WorkbookShell";
import { UploadZone } from "../components/ui/UploadZone";
import { EmptyState } from "../components/ui/EmptyState";
import { WideButton } from "../components/ui/WideButton";
import { SplittedTable } from "../components/table/SplittedTable";
import { useWorkbookRegistry } from "../hooks/workbook/useWorkbookRegistry";
import { useSheetHeader } from "../hooks/workbook/useSheetHeader";
import { useSheetSplit } from "../hooks/workbook/useSheetSplit";
import { useWorkbookExport } from "../hooks/workbook/useWorkbookExport";

export function WorkbookSplitPage() {
  const registry = useWorkbookRegistry();
  const { loadedWorkbooks, activeWorkbookId, activeSheetId } = registry;

  const tableStates = useSheetHeader(loadedWorkbooks);
  const splitStates = useSheetSplit(loadedWorkbooks, tableStates);
  const { downloadOne, downloadAll } = useWorkbookExport(loadedWorkbooks, tableStates, splitStates);

  const workbookDescriptors = loadedWorkbooks.map((lw) => lw.descriptor);

  return (
    <PageLayout
      title="Workbook Split"
      icon={Layers}
      description={[
        "上傳 Excel 工作簿",
        "依欄位或列範圍拆分成多張工作表",
        "若找不到欄位，保留原檔可供下載",
      ]}
    >
      {loadedWorkbooks.length === 0 ? (
        <EmptyState>
          <UploadZone
            onUpload={(files) => files.forEach(registry.addWorkbook)}
            accept=".xlsx,.xls,.csv"
            multiple
            hint="Supports .xlsx, .xls, .csv"
          />
        </EmptyState>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          <div className="flex justify-end">
            <WideButton
              icon={ArchiveIcon}
              label="Download All"
              variant="outline"
              onClick={downloadAll}
            />
          </div>
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
              const tableState = tableStates[workbookId]?.[sheetId];
              const splitState = splitStates[workbookId]?.[sheetId];
              if (!sheet || !tableState || !splitState) return null;
              return (
                <SplittedTable
                  sheet={sheet}
                  tableState={tableState}
                  splitState={splitState}
                />
              );
            }}
          </WorkbookShell>
        </div>
      )}
    </PageLayout>
  );
}
