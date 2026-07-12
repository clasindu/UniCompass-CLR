import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProfile } from "../services/profileService";
import { getCareerRoadmap } from "../services/advisorService";
import type { CareerRoadmap } from "../types/advisor";

export default function CareerPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  const run = useMutation({
    mutationFn: () =>
      getCareerRoadmap({
        careerGoal: profile?.careerGoal ?? "",
        skills: (profile?.skills ?? []).map((s) => ({
          name: s.skillName,
          level: s.proficiencyLevel,
        })),
      }),
    onSuccess: (data) => setRoadmap(data),
  });

  const hasGoal = !!profile?.careerGoal;
  const hasSkills = (profile?.skills?.length ?? 0) > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          AI career guidance
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Your career roadmap
        </h1>
        <p className="mt-2 text-slate">
          See which skills you still need for your goal, and a step-by-step plan
          to get there.
        </p>

        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-6">
          {!hasGoal || !hasSkills ? (
            <p className="text-slate">
              Set a <strong>career goal</strong> and add some <strong>skills</strong>{" "}
              on your Profile page first — then come back for your roadmap.
            </p>
          ) : (
            <>
              <p className="text-ink-soft">
                Target: <span className="font-semibold text-ink">{profile?.careerGoal}</span>
              </p>
              <button
                className="btn-primary mt-4"
                disabled={run.isPending}
                onClick={() => run.mutate()}
              >
                {run.isPending ? "Building roadmap…" : "Generate my roadmap"}
              </button>
              {run.isError && (
                <p className="mt-3 text-sm text-red-600">
                  Couldn't reach the AI service. Make sure it's running on port 8000.
                </p>
              )}
            </>
          )}
        </div>

        {roadmap && (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-ink/10 bg-white p-5">
                <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                  Skills you have
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.matchedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-sm text-green-800"
                    >
                      {s}
                    </span>
                  ))}
                  {roadmap.matchedSkills.length === 0 && (
                    <p className="text-sm text-slate">None matched yet.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-ink/10 bg-white p-5">
                <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                  Skills to learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roadmap.missingSkills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-sm text-amber-deep"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5">
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                Learning roadmap
              </h3>
              <div className="space-y-4">
                {roadmap.roadmap.map((ph, i) => (
                  <div key={i} className="border-l-2 border-amber pl-4">
                    <p className="font-semibold text-ink">{ph.phase}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {ph.skills.map((s, j) => (
                        <span
                          key={j}
                          className="rounded bg-parchment-dim px-2 py-0.5 text-xs text-ink-soft"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {ph.projectIdea && (
                      <p className="mt-2 text-sm text-slate">
                        <span className="font-medium text-ink-soft">Project idea:</span>{" "}
                        {ph.projectIdea}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
