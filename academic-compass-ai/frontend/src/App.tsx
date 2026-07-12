import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AcademicPage from "./pages/AcademicPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import ExamPlannerPage from "./pages/ExamPlannerPage";
import AiAssistantPage from "./pages/AiAssistantPage";
import AcademicAdvisorPage from "./pages/AcademicAdvisorPage";
import CareerPage from "./pages/CareerPage";
import TimetablePage from "./pages/TimetablePage";
import WellnessPage from "./pages/WellnessPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MentorPage from "./pages/MentorPage";
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
      <Route
        path="/app/ai"
        element={
          <ProtectedRoute>
            <AiAssistantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/advisor"
        element={<ProtectedRoute><AcademicAdvisorPage /></ProtectedRoute>}
      />
      <Route
        path="/app/career"
        element={<ProtectedRoute><CareerPage /></ProtectedRoute>}
      />
      <Route
        path="/app/timetable"
        element={<ProtectedRoute><TimetablePage /></ProtectedRoute>}
      />
      <Route
        path="/app/wellness"
        element={<ProtectedRoute><WellnessPage /></ProtectedRoute>}
      />
      <Route
        path="/app/mentors"
        element={<ProtectedRoute><MentorPage /></ProtectedRoute>}
      />
      <Route
        path="/app/bookings"
        element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
