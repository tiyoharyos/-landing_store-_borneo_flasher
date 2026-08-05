export default function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 420 420"
      className="w-full max-w-[380px] h-auto"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustrasi servis dan flashing perangkat"
    >
      {/* blob background */}
      <path
        d="M210 32c78 0 148 44 168 118 18 68-14 152-84 186-70 34-162 20-206-40-42-58-40-146 6-202 34-42 76-62 116-62Z"
        fill="var(--brand-tint)"
      />
      <circle cx="343" cy="88" r="10" fill="var(--accent-tint)" />
      <circle cx="60" cy="300" r="14" fill="var(--accent-tint)" />
      <circle cx="72" cy="96" r="7" fill="var(--amber)" opacity="0.55" />

      {/* orbit ring */}
      <circle cx="210" cy="212" r="140" fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="3 9" />

      {/* wrench, behind phone */}
      <g transform="translate(96 250) rotate(-28)">
        <rect x="0" y="0" width="150" height="20" rx="10" fill="var(--accent)" />
        <circle cx="10" cy="10" r="17" fill="none" stroke="var(--accent)" strokeWidth="9" />
        <circle cx="140" cy="10" r="17" fill="none" stroke="var(--accent)" strokeWidth="9" />
      </g>

      {/* shipping box, bottom right */}
      <g transform="translate(272 268)">
        <rect x="0" y="18" width="86" height="70" rx="6" fill="var(--surface)" stroke="var(--line)" strokeWidth="2" />
        <path d="M0 18 43 0 86 18 43 36Z" fill="var(--cream-deep)" stroke="var(--line)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M43 36V88" stroke="var(--line)" strokeWidth="2" />
        <path d="M14 30 43 42 72 30" stroke="var(--brand)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* phone body */}
      <g transform="translate(140 96)">
        <rect x="0" y="0" width="146" height="252" rx="28" fill="var(--brand)" />
        <rect x="10" y="14" width="126" height="224" rx="18" fill="var(--surface)" />
        <rect x="52" y="26" width="42" height="6" rx="3" fill="var(--line)" />

        {/* lightning bolt = "flasher" */}
        <path
          d="M84 66 44 150h30l-14 60 58-84H88Z"
          fill="var(--brand)"
        />
        <path
          d="M84 66 44 150h30l-14 60 58-84H88Z"
          fill="none"
          stroke="var(--brand-dark)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* progress bar */}
        <rect x="30" y="196" width="86" height="10" rx="5" fill="var(--cream-deep)" />
        <rect x="30" y="196" width="58" height="10" rx="5" fill="var(--accent)" />
        <circle cx="73" cy="230" r="10" fill="var(--line)" />
      </g>

      {/* small spark accents around phone */}
      <path d="M312 150l6 14 14 6-14 6-6 14-6-14-14-6 14-6Z" fill="var(--amber)" />
      <path d="M98 160l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="var(--accent)" opacity="0.8" />
    </svg>
  );
}
