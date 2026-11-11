import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BrainDumpPage from "./pages/BrainDumpPage";

import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./pages/SettingsPage";
function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/signup"
        element={<SignupPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/tasks"
          element={<TasksPage />}
        />

        <Route
          path="/calendar"
          element={<CalendarPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/brain-dump"
          element={<BrainDumpPage />}
        />

        <Route
         path="/settings"
         element={<SettingsPage />}
         />
         
      </Route>

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}

export default App;