import { FormEvent, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import FormError from "../components/FormError";
import {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  getUniversities,
  getDegrees,
} from "../services/profileService";

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: universities = [] } = useQuery({ queryKey: ["universities"], queryFn: getUniversities });
  const { data: degrees = [] } = useQuery({ queryKey: ["degrees"], queryFn: getDegrees });

  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [interests, setInterests] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState(3);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? "");
      setUniversityId(profile.universityId ?? "");
      setDegreeId(profile.degreeId ?? "");
      setCareerGoal(profile.careerGoal ?? "");
      setInterests(profile.interests ?? "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        fullName,
        universityId: universityId || null,
        degreeId: degreeId || null,
        careerGoal: careerGoal || null,
        interests: interests || null,
      }),
    onSuccess: (data) => {
      qc.setQueryData(["profile"], data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err: any) =>
      setError(err.response?.data?.message ?? "Could not save your profile."),
  });

  const addSkillMutation = useMutation({
    mutationFn: () => addSkill(skillName, proficiency),
    onSuccess: (data) => {
      qc.setQueryData(["profile"], data);
      setSkillName("");
      setProficiency(3);
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: (id: string) => removeSkill(id),
    onSuccess: (data) => qc.setQueryData(["profile"], data),
  });

  function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    saveMutation.mutate();
  }

  function handleAddSkill(e: FormEvent) {
    e.preventDefault();
    if (skillName.trim()) addSkillMutation.mutate();
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-slate">Loading your profile…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Your details
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Profile</h1>
        <p className="mt-2 text-slate">
          This is the context your compass uses to steer everything else.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-4 rounded-lg border border-ink/10 bg-white p-6">
          <FormError message={error} />
          <div>
            <label className="field-label">Full name</label>
            <input className="field-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">University</label>
              <select className="field-input" value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
                <option value="">Select…</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Degree</label>
              <select className="field-input" value={degreeId} onChange={(e) => setDegreeId(e.target.value)}>
                <option value="">Select…</option>
                {degrees.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Career goal</label>
            <input className="field-input" value={careerGoal} placeholder="e.g. Backend Engineer"
              onChange={(e) => setCareerGoal(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Learning interests</label>
            <textarea className="field-input" rows={2} value={interests}
              placeholder="e.g. distributed systems, UI design"
              onChange={(e) => setInterests(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
              {saveMutation.isPending ? "Saving…" : "Save profile"}
            </button>
            {saved && <span className="text-sm font-medium text-green-700">Saved</span>}
          </div>
        </form>

        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-ink">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.skills.length ? (
              profile.skills.map((s) => (
                <span key={s.id}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-parchment px-3 py-1 text-sm">
                  {s.skillName}
                  <span className="text-xs text-slate">L{s.proficiencyLevel}</span>
                  <button onClick={() => removeSkillMutation.mutate(s.id)}
                    className="text-slate hover:text-red-600" aria-label={`Remove ${s.skillName}`}>
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-slate">No skills yet — add your first below.</p>
            )}
          </div>
          <form onSubmit={handleAddSkill} className="mt-5 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label className="field-label">Skill</label>
              <input className="field-input" value={skillName} placeholder="e.g. Java"
                onChange={(e) => setSkillName(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Level</label>
              <select className="field-input" value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button type="submit" disabled={addSkillMutation.isPending} className="btn-ghost">
              Add skill
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
