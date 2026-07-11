import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CompassMark from "../components/CompassMark";
import { useAuthStore } from "../store/authStore";
import { logout as logoutApi } from "../services/authService";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/profile", label: "Profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutApi();
    } finally {
      clearAuth();
      navigate("/login");
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-ink/10 bg-white">
        <div className="flex items-center gap-2.5 border-b border-ink/10 px-6 py-5 text-ink">
          <CompassMark size={32} />
          <span className="font-display text-lg font-semibold">Compass</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-parchment"
                    : "text-ink-soft hover:bg-parchment-dim"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink/10 px-4 py-4">
          <p className="truncate text-xs text-slate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 text-sm font-medium text-amber-deep hover:underline"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-parchment px-8 py-10">{children}</main>
    </div>
  );
}
