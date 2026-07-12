import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAssignments } from "../services/assignmentService";
import { getExams } from "../services/examService";
import { getStudyTimetable } from "../services/advisorService";
import type { StudyTimetable } from "../types/advisor";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Format "18:00" -> "6:00 PM"
function fmt(t: string): string {
  if (!t || !t.includes(":")) return t;
  const [hStr, m] = t.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export default function TimetablePage() {
  const { data: assignments = [] } = useQuery({ queryKey: ["assignments"], queryFn: getAssignments });
  const { data: exams = [] } = useQuery({ queryKey: ["exams"], queryFn: getExams });
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [timetable, setTimetable] = useState<StudyTimetable | null>(null);

  const run = useMutation({
    mutationFn: () =>
      getStudyTimetable({
        hoursPerDay,
        assignments: assignments.map((a) => ({
          title: a.title,
          deadline: a.deadline,
          difficulty: a.difficulty,
          status: a.status,
        })),
        exams: exams.map((e) => ({
          title: e.title,
          examDate: e.examDate,
          daysRemaining: e.daysRemaining,
          preparationStatus: e.preparationStatus,
        })),
      }),
    onSuccess: (data) => setTimetable(data),
  });

  const hasWork = assignments.length > 0 || exams.length > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          AI smart timetable
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Your weekly plan
        </h1>
        <p className="mt-2 text-slate">
          A study schedule with time slots, prioritising your nearest deadlines
          and hardest work.
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-4 rounded-lg border border-ink/10 bg-white p-6">
          {!hasWork ? (
            <p className="text-slate">
              Add some assignments or exams first — then generate a plan around them.
            </p>
          ) : (
            <>
              <div>
                <label className="field-label">Study hours per day</label>
                <select
                  className="field-input"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} hours
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn-primary"
                disabled={run.isPending}
                onClick={() => run.mutate()}
              >
                {run.isPending ? "Planning…" : "Generate timetable"}
              </button>
              {run.isError && (
                <p className="w-full text-sm text-red-600">
                  Couldn't reach the AI service. Make sure it's running on port 8000.
                </p>
              )}
            </>
          )}
        </div>

        {timetable && (
          <div className="mt-6">
            {timetable.advice && (
              <div className="mb-4 rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-ink-soft">
                {timetable.advice}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DAYS.map((day) => {
                const blocks = timetable.blocks.filter(
                  (b) => b.day.toLowerCase() === day.toLowerCase()
                );
                if (blocks.length === 0) return null;
                return (
                  <div key={day} className="rounded-lg border border-ink/10 bg-white p-4">
                    <h3 className="mb-2 font-display font-semibold text-ink">{day}</h3>
                    <div className="space-y-2">
                      {blocks.map((b, i) => (
                        <div key={i} className="rounded-md bg-parchment p-2.5">
                          {(b.startTime || b.endTime) && (
                            <p className="text-xs font-semibold text-amber-deep">
                              {fmt(b.startTime)}{b.endTime ? ` – ${fmt(b.endTime)}` : ""}
                            </p>
                          )}
                          <p className="mt-0.5 text-sm font-medium text-ink">{b.focus}</p>
                          {b.reason && (
                            <p className="mt-0.5 text-xs text-slate">{b.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
