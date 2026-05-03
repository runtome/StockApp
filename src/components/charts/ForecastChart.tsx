"use client";
import { useEffect, useRef, useState } from "react";
import type { OHLCV } from "@/lib/types/stock";
import type { PredictionPoint } from "@/lib/types/forecast";

interface ForecastChartProps {
  history: OHLCV[];
  predictions: PredictionPoint[];
  height?: number;
}

export function ForecastChart({ history, predictions, height = 160 }: ForecastChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(326);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    setWidth(containerRef.current.clientWidth);
    return () => observer.disconnect();
  }, []);

  if (!history.length || !predictions.length) return null;

  const histPrices = history.map((h) => h.close);
  const predPrices = predictions.map((p) => p.price);
  const allPrices = [
    ...histPrices,
    ...predPrices,
    ...predictions.map((p) => p.lower),
    ...predictions.map((p) => p.upper),
  ];
  const min = Math.min(...allPrices) * 0.985;
  const max = Math.max(...allPrices) * 1.015;
  const range = max - min || 1;

  const padL = 4;
  const padR = 36;
  const total = history.length + predictions.length - 1;
  const W = width;
  const H = height;

  const xAt = (i: number) => padL + ((W - padL - padR) * i) / total;
  const yAt = (v: number) => H - ((v - min) / range) * (H - 8) - 4;

  const histPoints = histPrices.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  const divX = xAt(history.length - 1);

  const forecastPoints = [
    `${xAt(history.length - 1)},${yAt(histPrices[histPrices.length - 1])}`,
    ...predPrices.map((v, i) => `${xAt(history.length + i)},${yAt(v)}`),
  ].join(" ");

  const conePoints = [
    `${xAt(history.length - 1)},${yAt(histPrices[histPrices.length - 1])}`,
    ...predictions.map((p, i) => `${xAt(history.length + i)},${yAt(p.upper)}`),
    ...predictions.slice().reverse().map((p, i) => `${xAt(history.length + predictions.length - 1 - i)},${yAt(p.lower)}`),
    `${xAt(history.length - 1)},${yAt(histPrices[histPrices.length - 1])}`,
  ].join(" ");

  const lastForecastX = xAt(history.length + predictions.length - 1);
  const lastForecastY = yAt(predPrices[predPrices.length - 1]);

  const ticks = [min + range * 0.2, min + range * 0.5, min + range * 0.8];

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Y axis ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} y1={yAt(t)} x2={W - padR} y2={yAt(t)} stroke="var(--color-hairline)" strokeWidth={1} />
            <text x={W - padR + 4} y={yAt(t) + 4} fontSize={9} fill="var(--color-muted2)" fontFamily="var(--font-mono)">
              {t.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Confidence cone */}
        <polygon points={conePoints} fill="var(--color-ai)" opacity={0.12} />

        {/* History line */}
        <polyline points={histPoints} fill="none" stroke="var(--color-ink2)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* NOW divider */}
        <line x1={divX} y1={4} x2={divX} y2={H - 4} stroke="var(--color-muted)" strokeWidth={1} strokeDasharray="3,3" />
        <text x={divX + 3} y={14} fontSize={8} fill="var(--color-muted)" fontWeight={600} letterSpacing={0.5}>NOW</text>

        {/* Forecast dashed line */}
        <polyline points={forecastPoints} fill="none" stroke="var(--color-ai)" strokeWidth={1.5} strokeDasharray="4,3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Final price dot + label */}
        <circle cx={lastForecastX} cy={lastForecastY} r={3.5} fill="var(--color-ai)" />
        <text x={lastForecastX - 2} y={lastForecastY - 7} fontSize={9} fill="var(--color-ai)" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight={600}>
          {predPrices[predPrices.length - 1].toFixed(2)}
        </text>
      </svg>

      {/* X axis labels */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: padL, paddingRight: padR, marginTop: 4 }}>
        <span style={{ fontSize: 9, color: "var(--color-muted2)" }}>{history[0]?.date}</span>
        <span style={{ fontSize: 9, color: "var(--color-muted2)" }}>Today</span>
        <span style={{ fontSize: 9, color: "var(--color-ai)" }}>+{predictions.length}d</span>
      </div>
    </div>
  );
}
