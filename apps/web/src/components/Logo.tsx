export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M23 12 C23 5 41 5 41 12" stroke="#111827" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <rect x="21" y="10.5" width="22" height="3.4" rx="1.7" fill="#111827" />
      <rect x="25" y="13" width="14" height="7" rx="1.5" fill="#374151" />
      <path
        d="M39 17 C50 20 50 32 43 37 C39 40 37 44 39 48"
        stroke="#111827"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="39" cy="48" r="3" fill="#111827" />
      <rect x="17" y="19" width="28" height="35" rx="9" fill="#dc2626" />
      <rect x="22" y="24" width="4.5" height="25" rx="2.25" fill="#f87171" />
      <rect x="14" y="49" width="34" height="8" rx="3" fill="#991b1b" />
    </svg>
  );
}
