import { FormEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getSemesters,
  createSemester,
  createSubject,
  recordGrade,
  getGpa,
} from "../services/academicService";

// SLTC grade set (best to worst). E is the failing grade; no D- or F.
const SLTC_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E"];

export default function AcademicPage() {
  const qc = useQueryClient();
  const { data: semesters = [], isLoading } = useQuery({
    queryKey: ["semesters"],
    queryFn: getSemesters,
  });
  const { data: gpa } = useQuery({ queryKey: ["gpa"], queryFn: getGpa });

  const [semesterName, setSemesterName] = useState("");
  const [activeSemester, setActiveSemester] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [creditHours, setCreditHours] = useState(3);
  const [gradeBySubject, setGradeBySubject] = useState<Record<string, string>>({});

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["semesters"] });
    qc.invalidateQueries({ queryKey: ["gpa"] });
  };

  const addSemester = useMutation({
    mutationFn: () =>
      createSemester({ name: semesterName, startDate: null, endDate: null }),
    onSuccess: () => {
      setSemesterName("");
      refresh();
    },
  });

  const addSubject = useMutation({
    mutationFn: (semesterId: string) =>
      createSubject({ semesterId, name: subjectName, creditHours }),
    onSuccess: () => {
      setSubjectName("");
      setCreditHours(3);
      refresh();
    },
  });

  const addGrade = useMutation({
    mutationFn: (vars: { subjectId: string; letterGrade: string }) =>
      recordGrade(vars.subjectId, { assessmentType: "FINAL", letterGrade: vars.letterGrade }),
    onSuccess: () => refresh(),
  });

  function handleAddSemester(e: FormEvent) {
    e.preventDefault();
    if (semesterName.trim()) addSemester.mutate();
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-slate">Loading your academic record…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Academic record
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Academic</h1>

        {/* GPA summary */}
        <div className="mt-6 rounded-lg border border-ink/10 bg-ink px-6 py-5 text-parchment">
          <p className="text-sm text-parchment/60">Cumulative GPA</p>
          <p className="mt-1 font-display text-4xl font-semibold">
            {gpa ? gpa.cumulativeGpa.toFixed(2) : "0.00"}
          </p>
          {gpa && gpa.perSemester.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-parchment/70">
              {gpa.perSemester.map((s) => (
                <span key={s.semesterName}>
                  {s.semesterName}: <strong>{s.gpa.toFixed(2)}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add semester */}
        <form
          onSubmit={handleAddSemester}
          className="mt-6 flex items-end gap-3 rounded-lg border border-ink/10 bg-white p-5"
        >
          <div className="flex-1">
            <label className="field-label">New semester</label>
            <input
              className="field-input"
              value={semesterName}
              placeholder="e.g. Level 4 Semester 1"
              onChange={(e) => setSemesterName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={addSemester.isPending}>
            Add semester
          </button>
        </form>

        {/* Semesters list */}
        <div className="mt-6 space-y-5">
          {semesters.length === 0 && (
            <p className="text-slate">No semesters yet — add your first above.</p>
          )}
          {semesters.map((sem) => (
            <div key={sem.id} className="rounded-lg border border-ink/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-ink">{sem.name}</h3>
                <button
                  className="text-sm font-medium text-amber-deep hover:underline"
                  onClick={() =>
                    setActiveSemester(activeSemester === sem.id ? null : sem.id)
                  }
                >
                  {activeSemester === sem.id ? "Close" : "Add subject"}
                </button>
              </div>

              {/* Subjects */}
              <div className="mt-3 space-y-2">
                {sem.subjects.length === 0 && (
                  <p className="text-sm text-slate">No subjects yet.</p>
                )}
                {sem.subjects.map((sub) => {
                  const latest = sub.grades[0];
                  return (
                    <div
                      key={sub.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-parchment px-3 py-2"
                    >
                      <div>
                        <span className="font-medium text-ink">{sub.name}</span>
                        <span className="ml-2 text-xs text-slate">
                          {sub.creditHours} credits
                        </span>
                        {latest && (
                          <span className="ml-2 text-sm font-semibold text-amber-deep">
                            {latest.letterGrade} · {latest.gpaPoints.toFixed(2)} pts
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="w-24 rounded border border-ink/15 px-2 py-1 text-sm"
                          value={gradeBySubject[sub.id] ?? ""}
                          onChange={(e) =>
                            setGradeBySubject((m) => ({ ...m, [sub.id]: e.target.value }))
                          }
                        >
                          <option value="">Grade…</option>
                          {SLTC_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn-ghost py-1 text-sm"
                          onClick={() => {
                            const g = gradeBySubject[sub.id];
                            if (g) addGrade.mutate({ subjectId: sub.id, letterGrade: g });
                          }}
                        >
                          Save grade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add subject form */}
              {activeSemester === sem.id && (
                <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-ink/10 pt-4">
                  <div className="flex-1 min-w-[160px]">
                    <label className="field-label">Subject name</label>
                    <input
                      className="field-input"
                      value={subjectName}
                      placeholder="e.g. Data Warehousing"
                      onChange={(e) => setSubjectName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Credits</label>
                    <select
                      className="field-input"
                      value={creditHours}
                      onChange={(e) => setCreditHours(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn-primary"
                    disabled={addSubject.isPending}
                    onClick={() => {
                      if (subjectName.trim()) addSubject.mutate(sem.id);
                    }}
                  >
                    Add subject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
