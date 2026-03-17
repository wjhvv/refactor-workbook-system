import { Outlet } from "react-router-dom";
import { NavBar } from "../nav/NavBar";

export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar title="Workbook System" />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
