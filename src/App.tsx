import { WorkbookShell } from "./components/workbook/WorkbookShell";
import { mockWorkbooks } from "./mock/workbookData";

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 text-sm text-gray-400">
        （上方其他內容）
      </div>
      <WorkbookShell workbooks={mockWorkbooks}>
        {(workbookId, sheetId) => (
          <div className="p-4 text-sm text-gray-600">
            <p>Workbook: {workbookId}</p>
            <p>Sheet: {sheetId}</p>
          </div>
        )}
      </WorkbookShell>
    </div>
  );
}
