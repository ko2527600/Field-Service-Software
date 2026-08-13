function Teardrop({
  transform,
  fill,
  opacity = 1,
}: {
  transform?: string;
  fill: string;
  opacity?: number;
}) {
  return (
    <path
      d="M0,-160 C55,-90 70,-20 40,40 C20,75 -20,75 -40,40 C-70,-20 -55,-90 0,-160 Z"
      fill={fill}
      opacity={opacity}
      transform={transform}
    />
  );
}

/** Flat-vector "extinguishing a fire" scene, matching the Logo's palette/style. Used as a full-bleed background on auth pages. */
export function AuthHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="authBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <radialGradient id="authGlow" cx="68%" cy="52%" r="45%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="900" height="1200" fill="url(#authBg)" />
      <rect width="900" height="1200" fill="url(#authGlow)" />

      {/* ground shadow */}
      <ellipse cx="400" cy="860" rx="220" ry="26" fill="#000000" opacity="0.35" />

      {/* flame */}
      <g transform="translate(650,600)">
        <Teardrop transform="rotate(-6)" fill="#ea580c" />
        <Teardrop transform="translate(0,26) scale(0.66) rotate(4)" fill="#f97316" />
        <Teardrop transform="translate(0,42) scale(0.4)" fill="#fbbf24" />
        <Teardrop transform="translate(-58,20) rotate(-28) scale(0.32)" fill="#f97316" opacity={0.9} />
        <Teardrop transform="translate(60,28) rotate(24) scale(0.28)" fill="#ea580c" opacity={0.9} />
      </g>

      {/* smoke wisps where spray meets flame */}
      <circle cx="560" cy="520" r="22" fill="#cbd5e1" opacity="0.12" />
      <circle cx="585" cy="470" r="16" fill="#cbd5e1" opacity="0.1" />
      <circle cx="540" cy="470" r="12" fill="#cbd5e1" opacity="0.1" />

      {/* person */}
      <g>
        <circle cx="345" cy="472" r="36" fill="#111827" />
        <rect x="-26" y="-90" width="52" height="150" rx="26" fill="#111827" transform="translate(345,592) rotate(14)" />
        {/* back (support) leg */}
        <path d="M345,668 C316,712 296,768 306,830" stroke="#111827" strokeWidth="34" strokeLinecap="round" fill="none" />
        {/* front (lunging) leg */}
        <path d="M355,672 C400,706 438,748 462,818" stroke="#111827" strokeWidth="34" strokeLinecap="round" fill="none" />
        {/* back arm, bracing */}
        <path d="M338,518 C298,510 268,538 258,578" stroke="#111827" strokeWidth="26" strokeLinecap="round" fill="none" />
        {/* front arm, extended toward flame */}
        <path d="M358,514 C420,498 480,478 532,452" stroke="#111827" strokeWidth="28" strokeLinecap="round" fill="none" />

        {/* extinguisher in hand */}
        <g transform="translate(532,452) rotate(58)">
          <rect x="-14" y="-55" width="28" height="70" rx="10" fill="#dc2626" />
          <rect x="-7" y="-50" width="7" height="55" rx="3.5" fill="#f87171" />
          <rect x="-16" y="12" width="32" height="10" rx="4" fill="#991b1b" />
          <circle cx="0" cy="-58" r="6" fill="#374151" />
        </g>
      </g>

      {/* spray mist */}
      <path d="M537,447 L636,548 L658,590 L556,512 Z" fill="#f8fafc" opacity="0.16" />
      <circle cx="575" cy="500" r="7" fill="#f8fafc" opacity="0.5" />
      <circle cx="598" cy="530" r="5" fill="#f8fafc" opacity="0.4" />
      <circle cx="560" cy="528" r="5" fill="#f8fafc" opacity="0.35" />
      <circle cx="614" cy="558" r="8" fill="#f8fafc" opacity="0.3" />
      <circle cx="548" cy="480" r="4" fill="#f8fafc" opacity="0.4" />
    </svg>
  );
}
