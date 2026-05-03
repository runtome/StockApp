interface ChipProps {
  label: string;
  variant?: "default" | "up" | "down" | "ai" | "active";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Chip({ label, variant = "default", size = "sm", onClick, className, style }: ChipProps) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: "var(--color-chip)", color: "var(--color-chip-ink)" },
    up: { background: "var(--color-up-bg)", color: "var(--color-up)" },
    down: { background: "var(--color-down-bg)", color: "var(--color-down)" },
    ai: { background: "var(--color-ai-bg)", color: "var(--color-ai-ink)" },
    active: { background: "var(--color-ai)", color: "var(--color-bg)" },
  };

  return (
    <span
      className={className}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "sm" ? "3px 8px" : "5px 12px",
        borderRadius: 20,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        letterSpacing: 0.2,
        ...styles[variant],
        ...style,
      }}
    >
      {label}
    </span>
  );
}
