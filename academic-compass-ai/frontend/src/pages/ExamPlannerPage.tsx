import { FormEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getExams, createExam, updateExam, deleteExam } from "../services/examService";

const PREP_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "READY"] as const;
const PREP_LABEL: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "Preparing",
  READY: "Ready",
};

export default function ExamPlannerPage() {
  const qc = useQueryClient();
  const { data: exams = [], isLoading } = useQuery({ queryKey: ["exams"], queryFn: getExams });

  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examType, setExamType] = useState("FINAL");

  const refresh = () => qc.invalidateQueries({ queryKey: ["exams"] });

  const add = useMutation({
    mutationFn: () =>
      createExam({ title, subjectId: null, examDate, examType }),
    onSuccess: () => {
      setTitle("");
      setExamDate("");
      setExamType("FINAL");
      refresh();
    },
  });

  const setPrep = useMutation({
    mutationFn: (vars: { id: string; status: string }) =>
      updateExam(vars.id, { preparationStatus: vars.status }),
    onSuccess: () => refresh(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => refresh(),
  });

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (title.trim() && examDate) add.mutate();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Exam planner
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Exams</h1>

        <form
          onSubmit={handleAdd}
          className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-ink/10 bg-white p-5"
        >
          <div className="flex-1 min-w-[180px]">
            <label className="field-label">Exam title</label>
            <input
              className="field-input"
              value={title}
              placeholder="e.g. Artificial Intelligence"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Date</label>
            <input
              type="date"
              className="field-input"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Type</label>
            <select
              className="field-input"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={add.isPending}>
            Add exam
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-slate">Loading…</p>}
          {!isLoading && exams.length === 0 && (
            <p className="text-slate">No exams scheduled — add your first above.</p>
          )}
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-semibold text-ink">{ex.title}</span>
                  <span className="rounded-full bg-parchment-dim px-2 py-0.5 text-xs text-ink-soft">
                    {ex.examType}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate">
                  {new Date(ex.examDate).toLocaleDateString()} ·{" "}
                  <span className={ex.daysRemaining <= 7 ? "font-semibold text-red-600" : ""}>
                    {ex.daysRemaining >= 0
                      ? `${ex.daysRemaining} days remaining`
                      : "past"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded border border-ink/15 px-2 py-1 text-sm"
                  value={ex.preparationStatus}
                  onChange={(e) => setPrep.mutate({ id: ex.id, status: e.target.value })}
                >
                  {PREP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {PREP_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove.mutate(ex.id)}
                  className="text-slate hover:text-red-600"
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
