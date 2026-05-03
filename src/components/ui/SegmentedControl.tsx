"use client";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-xl"
      style={{ background: "var(--color-chip)" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex-1 py-1 rounded-lg text-center transition-all"
            style={{
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? "var(--color-ink)" : "var(--color-muted)",
              background: active ? "var(--color-panel)" : "transparent",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
