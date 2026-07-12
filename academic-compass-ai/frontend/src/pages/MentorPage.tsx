import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProviders, createBooking } from "../services/bookingService";
import type { Provider } from "../types/booking";

export default function MentorPage() {
  const qc = useQueryClient();
  const [booking, setBooking] = useState<Provider | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [reason, setReason] = useState("");
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["providers", "MENTOR"],
    queryFn: () => getProviders("MENTOR"),
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
      setConfirmMsg(`Session requested with ${booking?.name}.`);
      setBooking(null);
      setBookingDate("");
      setBookingTime("");
      setReason("");
      qc.invalidateQueries({ queryKey: ["myBookings"] });
      setTimeout(() => setConfirmMsg(null), 4000);
    },
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Career guidance
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Mentors
        </h1>
        <p className="mt-2 text-slate">
          Book a session with a university lecturer, a senior student, or an
          industry expert — for academic guidance, career advice, portfolio
          review, or interview prep.
        </p>

        {confirmMsg && (
          <div className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            {confirmMsg}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-slate">Loading…</p>}
          {!isLoading && mentors.length === 0 && (
            <p className="text-slate">No mentors available right now.</p>
          )}
          {mentors.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-semibold text-ink">
                    {m.name}
                  </span>
                  <span className="rounded-full bg-parchment-dim px-2 py-0.5 text-xs text-ink-soft">
                    {m.specialty}
                  </span>
                </div>
                {m.qualification && (
                  <p className="mt-0.5 text-xs text-amber-deep">{m.qualification}</p>
                )}
                {m.bio && <p className="mt-1 text-sm text-slate">{m.bio}</p>}
              </div>
              <button className="btn-primary" onClick={() => setBooking(m)}>
                Book session
              </button>
            </div>
          ))}
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
                <label className="field-label">What do you want help with? (optional)</label>
                <textarea
                  className="field-input"
                  rows={2}
                  value={reason}
                  placeholder="e.g. final year project, interview prep, career advice"
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
                {book.isPending ? "Booking…" : "Confirm booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
