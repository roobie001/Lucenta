import { useId } from "react";

export function Wordmark({ className = "" }: { className?: string }) {
  const gradientId = `wordmark-teal-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="16 16 424 128"
      role="img"
      aria-label="Lucentaa"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      <g transform="translate(16,16)">
        <rect width="128" height="128" rx="28" fill="#0B1220" />
        <circle
          cx="64"
          cy="64"
          r="36"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
        />
        <rect
          x="24"
          y="61"
          width="80"
          height="6"
          rx="3"
          fill={`url(#${gradientId})`}
        />
        <circle cx="88" cy="40" r="5" fill="#F59E0B" />
        <path
          d="M 64 100 A 36 36 0 0 1 37 88"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>

      <text
        x="176"
        y="98"
        fontSize="56"
        fontWeight="700"
        fill="#E2E8F0"
        style={{
          fontFamily:
            "var(--font-inter), Inter, -apple-system, Helvetica, Arial, sans-serif",
        }}
      >
        Lucent<tspan fill="#14B8A6">aa</tspan>
      </text>
    </svg>
  );
}
