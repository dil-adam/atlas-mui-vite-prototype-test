import { AppLayout } from "@diligentcorp/atlas-react-bundle";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import Navigation from "./Navigation.js";
import IndexPage from "./pages/IndexPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import { AuditsPage } from "./pages/AuditsPage.js";
import { PeoplePage } from "./pages/PeoplePage.js";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout navigation={<Navigation />}>
            <Outlet />
          </AppLayout>
        }
      >
        <Route index element={<IndexPage />} />
        <Route path="audits" element={<AuditsPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
