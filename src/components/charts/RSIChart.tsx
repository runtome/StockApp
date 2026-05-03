"use client";
import { useEffect, useRef } from "react";

interface RSIChartProps {
  data: { date: string; rsi: number | null }[];
  height?: number;
}

export function RSIChart({ data, height = 80 }: RSIChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;
    let chart: import("lightweight-charts").IChartApi | null = null;

    (async () => {
      const { createChart, ColorType, LineStyle, LineSeries } = await import("lightweight-charts");
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8A9099", fontSize: 10 },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.05, bottom: 0.05 }, autoScale: false },
        timeScale: { borderVisible: false, visible: false },
        handleScroll: false,
        handleScale: false,
      });

      const rsiSeries = chart.addSeries(LineSeries, {
        color: "oklch(0.78 0.14 75)",
        lineWidth: 2,
        priceScaleId: "right",
        lastValueVisible: true,
        priceLineVisible: false,
      });

      const validData = data
        .filter((d) => d.rsi != null)
        .map((d) => ({ time: d.date as import("lightweight-charts").Time, value: d.rsi as number }));
      rsiSeries.setData(validData);

      chart.timeScale().fitContent();
    })();

    return () => { chart?.remove(); };
  }, [data, height]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height }} />
      <div style={{ position: "absolute", top: 4, left: 0, fontSize: 9, color: "#8A9099", fontWeight: 600, letterSpacing: 0.5 }}>RSI 14</div>
    </div>
  );
}
