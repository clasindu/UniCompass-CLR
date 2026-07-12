import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getGpa, getSemesters } from "../services/academicService";
import { getAcademicAdvice } from "../services/advisorService";
import type { AcademicAdvice, SubjectPlanItem } from "../types/advisor";

export default function AcademicAdvisorPage() {
  const { data: gpa } = useQuery({ queryKey: ["gpa"], queryFn: getGpa });
  const { data: semesters = [] } = useQuery({ queryKey: ["semesters"], queryFn: getSemesters });
  const [advice, setAdvice] = useState<AcademicAdvice | null>(null);

  const run = useMutation({
    mutationFn: () => {
      const graded: any[] = [];
      const ungraded: any[] = [];
      semesters.forEach((s) => {
        s.subjects.forEach((sub) => {
          const latest = sub.grades[0];
          if (latest) {
            graded.push({
              semester: s.name,
              subject: sub.name,
              credits: sub.creditHours,
              grade: latest.letterGrade,
              gpaPoints: latest.gpaPoints,
            });
          } else {
            ungraded.push({ semester: s.name, subject: sub.name, credits: sub.creditHours });
          }
        });
      });
      return getAcademicAdvice({
        cumulativeGpa: gpa?.cumulativeGpa ?? 0,
        perSemester: gpa?.perSemester ?? [],
        passRule: "C- and above is a pass; D+, D, and E must be repeated; E is fail",
        gradedSubjects: graded,
        upcomingSubjects: ungraded,
      });
    },
    onSuccess: (data) => setAdvice(data),
  });

  const hasAnySubjects = semesters.some((s) => s.subjects.length > 0);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          AI academic advisor
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Your improvement plan
        </h1>
        <p className="mt-2 text-slate">
          Encouragement, a look at your results, retake help for any repeats
          and preparation for your upcoming subjects.
        </p>

        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-6">
          {!hasAnySubjects ? (
            <p className="text-slate">
              Add some subjects on the Academic page first &mdash; then come back for a
              personalised plan.
            </p>
          ) : (
            <>
              <p className="text-ink-soft">
                Current cumulative GPA:{" "}
                <span className="font-semibold text-ink">
                  {(gpa?.cumulativeGpa ?? 0).toFixed(2)}
                </span>
              </p>
              <button
                className="btn-primary mt-4"
                disabled={run.isPending}
                onClick={() => run.mutate()}
              >
                {run.isPending ? "Analysing…" : "Generate my plan"}
              </button>
              {run.isError && (
                <p className="mt-3 text-sm text-red-600">
                  Couldn't reach the AI service. Make sure it's running on port 8000.
                </p>
              )}
            </>
          )}
        </div>

        {advice && (
          <div className="mt-6 space-y-4">
            {advice.motivation && (
              <div className="rounded-lg border border-amber/30 bg-amber/10 p-5">
                <p className="font-display text-lg italic leading-relaxed text-ink">
                  {advice.motivation}
                </p>
              </div>
            )}

            {advice.analysis && (
              <Section title="Analysis">
                <p className="text-ink-soft">{advice.analysis}</p>
              </Section>
            )}

            {advice.strengths.length > 0 && (
              <Section title="Strengths">
                <ul className="space-y-1.5">
                  {advice.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft">
                      <span className="text-green-600">+</span> {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {advice.repeatSubjects.length > 0 && (
              <Section title="Subjects to repeat (retake help)">
                <div className="space-y-4">
                  {advice.repeatSubjects.map((r, i) => (
                    <SubjectCard key={i} item={r} tone="repeat" />
                  ))}
                </div>
              </Section>
            )}

            {advice.upcomingPlan.length > 0 && (
              <Section title="Preparing for upcoming subjects">
                <div className="space-y-4">
                  {advice.upcomingPlan.map((u, i) => (
                    <SubjectCard key={i} item={u} tone="upcoming" />
                  ))}
                </div>
              </Section>
            )}

            {advice.repeatSubjects.length === 0 && advice.upcomingPlan.length === 0 && (
              <p className="text-center text-sm text-slate">
                No repeats and no upcoming subjects to prepare &mdash; you're all caught up.
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function SubjectCard({ item, tone }: { item: SubjectPlanItem; tone: "repeat" | "upcoming" }) {
  const bg = tone === "repeat" ? "bg-red-50 border border-red-200" : "bg-parchment";
  return (
    <div className={`rounded-md p-4 ${bg}`}>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-ink">{item.subject}</p>
        {item.grade && (
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
            {item.grade}
          </span>
        )}
      </div>
      {item.advice && <p className="mt-1 text-sm text-ink-soft">{item.advice}</p>}
      {item.resources.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.resources.map((res, j) => (
            <li key={j} className="flex gap-2 text-sm text-slate">
              <span className="text-amber-deep">▸</span> {res}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5">
      <h3 className="mb-3 font-display text-lg font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}
