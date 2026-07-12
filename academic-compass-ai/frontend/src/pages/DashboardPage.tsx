import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuthStore } from "../store/authStore";

type Card = { to: string; title: string; desc: string };
type Group = { section: string; cards: Card[] };

const GROUPS: Group[] = [
  {
    section: "Academic",
    cards: [
      { to: "/app/academic", title: "Academic", desc: "Track your GPA and grades" },
      { to: "/app/assignments", title: "Assignments", desc: "Manage your deadlines" },
      { to: "/app/exams", title: "Exams", desc: "Plan exams with date, time & venue" },
    ],
  },
  {
    section: "AI Tools",
    cards: [
      { to: "/app/ai", title: "AI Assistant", desc: "PDF → summary, flashcards & quiz" },
      { to: "/app/advisor", title: "Advisor", desc: "Personalised improvement plan" },
      { to: "/app/career", title: "Career", desc: "Skill gap & learning roadmap" },
      { to: "/app/timetable", title: "Timetable", desc: "AI weekly study schedule" },
    ],
  },
  {
    section: "Support",
    cards: [
      { to: "/app/wellness", title: "Wellness", desc: "Medical, counseling & fitness" },
      { to: "/app/mentors", title: "Mentors", desc: "Lecturers, seniors & experts" },
      { to: "/app/bookings", title: "My Bookings", desc: "View & manage appointments" },
    ],
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Your bearings
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Welcome aboard
        </h1>
        <p className="mt-2 text-slate">
          Signed in as {user?.email}. Jump straight to any part of your compass.
        </p>

        <div className="mt-8 space-y-8">
          {GROUPS.map((group) => (
            <section key={group.section}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">
                {group.section}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.cards.map((c) => (
                  <Link
                    key={c.to}
                    to={c.to}
                    className="group rounded-lg border border-ink/10 bg-white p-5 transition-all hover:border-amber hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {c.title}
                      </h3>
                      <span className="text-amber-deep opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate">{c.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
