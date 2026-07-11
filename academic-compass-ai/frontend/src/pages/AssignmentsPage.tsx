import { FormEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";
import type { AssignmentResponse } from "../types/academic";

const STATUSES = ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED"] as const;
const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
};
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "text-red-600",
  MEDIUM: "text-amber-deep",
  LOW: "text-slate",
};

export default function AssignmentsPage() {
  const qc = useQueryClient();
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: getAssignments,
  });

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [difficulty, setDifficulty] = useState(3);

  const refresh = () => qc.invalidateQueries({ queryKey: ["assignments"] });

  const add = useMutation({
    mutationFn: () =>
      createAssignment({
        title,
        description: null,
        subjectId: null,
        deadline: new Date(deadline).toISOString(),
        priority,
        difficulty,
      }),
    onSuccess: () => {
      setTitle("");
      setDeadline("");
      setPriority("MEDIUM");
      setDifficulty(3);
      refresh();
    },
  });

  const setStatus = useMutation({
    mutationFn: (vars: { id: string; status: string }) =>
      updateAssignment(vars.id, { status: vars.status }),
    onSuccess: () => refresh(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => refresh(),
  });

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (title.trim() && deadline) add.mutate();
  }

  const byStatus = (s: string) => assignments.filter((a: AssignmentResponse) => a.status === s);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Coursework
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Assignments</h1>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-ink/10 bg-white p-5"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="field-label">Title</label>
            <input
              className="field-input"
              value={title}
              placeholder="e.g. Microservices Project"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Deadline</label>
            <input
              type="datetime-local"
              className="field-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Priority</label>
            <select
              className="field-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="field-label">Difficulty</label>
            <select
              className="field-input"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={add.isPending}>
            Add
          </button>
        </form>

        {isLoading ? (
          <p className="mt-6 text-slate">Loading…</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STATUSES.map((status) => (
              <div key={status} className="rounded-lg border border-ink/10 bg-parchment-dim/40 p-3">
                <h3 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  {STATUS_LABEL[status]} ({byStatus(status).length})
                </h3>
                <div className="space-y-2">
                  {byStatus(status).map((a) => (
                    <div key={a.id} className="rounded-md border border-ink/10 bg-white p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-ink">{a.title}</span>
                        <button
                          onClick={() => remove.mutate(a.id)}
                          className="text-slate hover:text-red-600"
                          aria-label="Delete"
                        >
                          ×
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate">
                        Due {new Date(a.deadline).toLocaleDateString()}
                      </p>
                      <p className={`mt-0.5 text-xs font-medium ${PRIORITY_COLOR[a.priority]}`}>
                        {a.priority} · difficulty {a.difficulty}
                      </p>
                      <div className="mt-2 flex gap-1">
                        {STATUSES.filter((s) => s !== status).map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus.mutate({ id: a.id, status: s })}
                            className="rounded border border-ink/15 px-2 py-0.5 text-[11px] text-ink-soft hover:border-ink/40"
                          >
                            → {STATUS_LABEL[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {byStatus(status).length === 0 && (
                    <p className="px-1 text-xs text-slate">Nothing here.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
