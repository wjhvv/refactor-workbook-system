import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { routes } from "./routes";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map(({ path, component: Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<Navigate to={routes[0].path} replace />} />
      </Route>
    </Routes>
  );
}
