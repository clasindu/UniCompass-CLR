import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyBookings, cancelBooking } from "../services/bookingService";

const STATUS_STYLE: Record<string, string> = {
  REQUESTED: "bg-amber/15 text-amber-deep",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
};

const CATEGORY_LABEL: Record<string, string> = {
  MEDICAL: "Medical",
  COUNSELING: "Counseling",
  MENTOR: "Mentor",
  FITNESS: "Fitness",
};

function fmtTime(t: string | null): string {
  if (!t) return "";
  const parts = t.split(":");
  if (parts.length < 2) return t;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export default function MyBookingsPage() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
  });

  const cancel = useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBookings"] }),
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          Your appointments
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          My bookings
        </h1>
        <p className="mt-2 text-slate">
          Your requested sessions with consultants, counselors, mentors, and coaches.
        </p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-slate">Loading…</p>}
          {!isLoading && bookings.length === 0 && (
            <p className="text-slate">
              No bookings yet — head to Wellness & mentors to book one.
            </p>
          )}
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-semibold text-ink">
                    {b.providerName}
                  </span>
                  <span className="rounded-full bg-parchment-dim px-2 py-0.5 text-xs text-ink-soft">
                    {CATEGORY_LABEL[b.category] ?? b.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLE[b.status] ?? ""
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate">{b.providerSpecialty}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {new Date(b.bookingDate).toLocaleDateString()}
                  {b.bookingTime ? ` · ${fmtTime(b.bookingTime)}` : ""}
                </p>
                {b.reason && <p className="mt-0.5 text-sm text-slate">"{b.reason}"</p>}
              </div>
              {b.status !== "CANCELLED" && (
                <button
                  className="btn-ghost text-sm"
                  onClick={() => cancel.mutate(b.id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
