import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Day 1: guards on the in-memory access token. If it's absent (e.g. after a
// refresh), the user is sent to /login. Day 6/7 hardening adds a silent
// refresh attempt here before redirecting.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
