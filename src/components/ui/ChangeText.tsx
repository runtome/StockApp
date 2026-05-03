interface ChangeTextProps {
  value: number;
  showSign?: boolean;
  suffix?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizes = { xs: 11, sm: 12, md: 14 };

export function ChangeText({ value, showSign = true, suffix = "%", size = "sm", className }: ChangeTextProps) {
  const isUp = value > 0;
  const isDown = value < 0;
  const color = isUp ? "var(--color-up)" : isDown ? "var(--color-down)" : "var(--color-muted)";
  const sign = showSign && isUp ? "+" : "";

  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: sizes[size],
        fontWeight: 600,
        color,
        fontFeatureSettings: '"tnum"',
      }}
    >
      {sign}{value.toFixed(2)}{suffix}
    </span>
  );
}
