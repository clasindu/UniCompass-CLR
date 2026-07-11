import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AcademicPage from "./pages/AcademicPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import ExamPlannerPage from "./pages/ExamPlannerPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const token = useAuthStore((s) => s.accessToken);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/app/dashboard" : "/login"} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/academic"
        element={
          <ProtectedRoute>
            <AcademicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/assignments"
        element={
          <ProtectedRoute>
            <AssignmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/exams"
        element={
          <ProtectedRoute>
            <ExamPlannerPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
