// The signature element: a compass needle mark used as the app's identity.
export default function CompassMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      {/* North needle in amber, south in ink */}
      <path d="M24 6 L28 24 L24 24 Z" fill="#E8A13A" />
      <path d="M24 42 L20 24 L24 24 Z" fill="currentColor" opacity="0.55" />
      <path d="M24 6 L20 24 L24 24 Z" fill="#C67E1C" />
      <path d="M24 42 L28 24 L24 24 Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
