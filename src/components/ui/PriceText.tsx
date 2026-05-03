interface PriceTextProps {
  value: number;
  decimals?: number;
  prefix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { sm: 13, md: 16, lg: 22, xl: 28 };

export function PriceText({ value, decimals = 2, prefix, size = "md", className }: PriceTextProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: sizes[size],
        fontWeight: 600,
        fontFeatureSettings: '"tnum"',
        color: "var(--color-ink)",
        letterSpacing: "-0.02em",
      }}
    >
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}
