import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProviders, createBooking } from "../services/bookingService";
import type { Provider, ProviderCategory } from "../types/booking";
import { CRISIS_HELPLINES, SYMPTOM_TO_SPECIALIST } from "../types/supportData";

// Wellness = health only: Medical, Counseling, Fitness. (Mentors is a separate page.)
const CATEGORIES: { key: ProviderCategory; label: string }[] = [
  { key: "MEDICAL", label: "Medical" },
  { key: "COUNSELING", label: "Counseling" },
  { key: "FITNESS", label: "Fitness & Health" },
];

export default function WellnessPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<ProviderCategory>("MEDICAL");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  const [booking, setBooking] = useState<Provider | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [reason, setReason] = useState("");
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["providers", category],
    queryFn: () => getProviders(category),
  });

  const book = useMutation({
    mutationFn: () =>
      createBooking({
        providerId: (booking as Provider).id,
        bookingDate,
        bookingTime: bookingTime || null,
        reason: reason || null,
      }),
    onSuccess: () => {
      setConfirmMsg(`Booking requested with ${booking?.name}.`);
      setBooking(null);
      setBookingDate("");
      setBookingTime("");
      setReason("");
      qc.invalidateQueries({ queryKey: ["myBookings"] });
      setTimeout(() => setConfirmMsg(null), 4000);
    },
  });

  const filtered = specialtyFilter
    ? providers.filter((p) => p.specialty === specialtyFilter)
    : providers;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Health & wellbeing
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Wellness
        </h1>
        <p className="mt-2 text-slate">
          Book a medical consultant, a counselor, or a fitness & health coach.
        </p>

        <div className="mt-4 rounded-lg border border-amber/40 bg-amber/10 p-4 text-sm text-ink-soft">
          This is a student project with demo providers. It does not provide
          diagnosis or treatment. For real medical or mental-health needs, please
          consult a licensed professional.
        </div>

        {/* Category tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCategory(c.key);
                setSpecialtyFilter("");
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                category === c.key
                  ? "bg-ink text-parchment"
                  : "border border-ink/15 text-ink-soft hover:border-ink/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {confirmMsg && (
          <div className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            {confirmMsg}
          </div>
        )}

        {/* Symptom -> specialist helper (medical only) */}
        {category === "MEDICAL" && (
          <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5">
            <h3 className="font-display text-lg font-semibold text-ink">
              Not sure which specialist?
            </h3>
            <p className="mt-1 text-sm text-slate">
              Pick what best matches your concern — we'll suggest a specialist type.
              This is guidance only, not a diagnosis.
            </p>
            <select
              className="field-input mt-3"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="">Show all specialists</option>
              {SYMPTOM_TO_SPECIALIST.map((s) => (
                <option key={s.concern} value={s.specialty}>
                  {s.concern} - {s.specialty}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Providers list */}
        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-slate">Loading...</p>}
          {!isLoading && filtered.length === 0 && (
            <p className="text-slate">No providers found.</p>
          )}
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="rounded-full bg-parchment-dim px-2 py-0.5 text-xs text-ink-soft">
                    {p.specialty}
                  </span>
                </div>
                {p.qualification && (
                  <p className="mt-0.5 text-xs text-amber-deep">{p.qualification}</p>
                )}
                {p.bio && <p className="mt-1 text-sm text-slate">{p.bio}</p>}
              </div>
              <button className="btn-primary" onClick={() => setBooking(p)}>
                Book
              </button>
            </div>
          ))}
        </div>

        {/* Crisis support (health page always shows it) */}
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
          <h3 className="font-display text-lg font-semibold text-red-800">
            Need urgent help now?
          </h3>
          <p className="mt-1 text-sm text-red-700">
            If you or someone you know is in crisis or thinking about self-harm,
            please reach out right away — these are free and confidential:
          </p>
          <ul className="mt-3 space-y-1.5">
            {CRISIS_HELPLINES.map((h) => (
              <li key={h.number} className="text-sm text-red-800">
                <span className="font-semibold">{h.number}</span> — {h.name}{" "}
                <span className="text-red-600">({h.note})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Booking modal */}
      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold text-ink">
              Book {booking.name}
            </h3>
            <p className="text-sm text-slate">{booking.specialty}</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="field-label">Date</label>
                <input
                  type="date"
                  className="field-input"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Time (optional)</label>
                <input
                  type="time"
                  className="field-input"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Reason (optional)</label>
                <textarea
                  className="field-input"
                  rows={2}
                  value={reason}
                  placeholder="Briefly, what's this about?"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="btn-ghost" onClick={() => setBooking(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!bookingDate || book.isPending}
                onClick={() => book.mutate()}
              >
                {book.isPending ? "Booking..." : "Confirm booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
