"use client";
import { useEffect, useRef } from "react";
import type { IChartApi } from "lightweight-charts";

interface RSIChartProps {
  data: { date: string; rsi: number | null }[];
  height?: number;
}

export function RSIChart({ data, height = 80 }: RSIChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const validData = data.filter((d) => d.rsi != null);
    if (!containerRef.current || !validData.length) return;

    let cancelled = false;
    let chart: IChartApi | null = null;

    (async () => {
      const { createChart, ColorType, LineSeries } = await import("lightweight-charts");
      if (cancelled || !containerRef.current) return;

      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8A9099", fontSize: 10 },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: { top: 0.05, bottom: 0.05 },
          // autoScale must be true so the 0-100 RSI range is visible
        },
        timeScale: { borderVisible: false, visible: false },
        handleScroll: false,
        handleScale: false,
      });

      const rsiSeries = chart.addSeries(LineSeries, {
        color: "#fbbf24",   // amber — hex instead of oklch
        lineWidth: 2,
        priceScaleId: "right",
        lastValueVisible: true,
        priceLineVisible: false,
      });

      rsiSeries.setData(
        validData.map((d) => ({
          time: d.date as import("lightweight-charts").Time,
          value: d.rsi as number,
        }))
      );

      chart.timeScale().fitContent();
    })();

    return () => {
      cancelled = true;
      chart?.remove();
    };
  }, [data, height]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height }} />
      <div style={{ position: "absolute", top: 4, left: 0, fontSize: 9, color: "#8A9099", fontWeight: 600, letterSpacing: 0.5 }}>RSI 14</div>
    </div>
  );
}
