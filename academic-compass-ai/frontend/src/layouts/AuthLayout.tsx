import { ReactNode } from "react";
import CompassMark from "../components/CompassMark";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left: brand panel — the characteristic thing first */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-ink p-12 text-parchment lg:flex">
        <div className="flex items-center gap-3 text-parchment">
          <CompassMark size={44} />
          <span className="font-display text-xl font-semibold tracking-tight">
            Academic Compass
          </span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-5xl font-semibold leading-tight">
            Find your bearing through every semester.
          </h1>
          <p className="mt-5 text-lg text-parchment/70">
            Track your GPA, plan your study time, and steer toward the career
            you're aiming for — one compass for the whole journey.
          </p>
        </div>
        <p className="text-sm text-parchment/40">
          SLTC · HNDM · Student Success Companion
        </p>
      </div>

      {/* Right: the form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-ink lg:hidden">
            <CompassMark size={32} />
            <span className="font-display text-lg font-semibold">Academic Compass</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
