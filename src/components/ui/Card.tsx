interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-panel)",
        borderRadius: 14,
        border: "1px solid var(--color-hairline)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
