interface ConfidenceRingProps {
  confidence: number;
  size?: number;
  direction?: string;
}

export function ConfidenceRing({ confidence, size = 96, direction }: ConfidenceRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (confidence / 100) * circumference;

  const dirColor =
    direction?.toLowerCase().includes("down")
      ? "var(--color-down)"
      : direction?.toLowerCase().includes("side")
      ? "var(--color-warn)"
      : "var(--color-up)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-chip)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ai)"
          strokeWidth={8}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--color-ai)" }}>
          {confidence}%
        </span>
        {direction && (
          <span style={{ fontSize: 9, fontWeight: 600, color: dirColor, letterSpacing: 0.3, marginTop: 1 }}>
            {direction.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
