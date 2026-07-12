import DashboardLayout from "../layouts/DashboardLayout";
import { useAuthStore } from "../store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Your bearings
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Welcome aboard
        </h1>
        <p className="mt-2 text-slate">
          Signed in as {user?.email}. The rest of your compass comes online as
          each module ships.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { title: "Academic", note: "Track your GPA and grades" },
            { title: "Assignments", note: "Manage your deadlines" },
            { title: "AI Assistant", note: "Notes & flashcards" },
            { title: "Career", note: "Skill roadmap" },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-lg border border-ink/10 bg-white p-5"
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                {c.title}
              </h3>
              <p className="mt-1 text-sm text-slate">{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}