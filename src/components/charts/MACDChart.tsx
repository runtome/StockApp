"use client";
import { useEffect, useRef } from "react";

interface MACDChartProps {
  data: { date: string; macd: number | null; macd_signal: number | null; macd_hist: number | null }[];
  height?: number;
}

export function MACDChart({ data, height = 80 }: MACDChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;
    let chart: import("lightweight-charts").IChartApi | null = null;

    (async () => {
      const { createChart, ColorType, HistogramSeries, LineSeries } = await import("lightweight-charts");
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8A9099", fontSize: 10 },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { borderVisible: false, visible: false },
        handleScroll: false,
        handleScale: false,
      });

      const histSeries = chart.addSeries(HistogramSeries, { priceLineVisible: false });
      histSeries.setData(
        data
          .filter((d) => d.macd_hist != null)
          .map((d) => ({
            time: d.date as import("lightweight-charts").Time,
            value: d.macd_hist as number,
            color: (d.macd_hist as number) >= 0 ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.6)",
          }))
      );

      const macdLine = chart.addSeries(LineSeries, { color: "oklch(0.72 0.16 285)", lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
      macdLine.setData(
        data.filter((d) => d.macd != null).map((d) => ({ time: d.date as import("lightweight-charts").Time, value: d.macd as number }))
      );

      const signalLine = chart.addSeries(LineSeries, { color: "oklch(0.78 0.14 75)", lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
      signalLine.setData(
        data.filter((d) => d.macd_signal != null).map((d) => ({ time: d.date as import("lightweight-charts").Time, value: d.macd_signal as number }))
      );

      chart.timeScale().fitContent();
    })();

    return () => { chart?.remove(); };
  }, [data, height]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height }} />
      <div style={{ position: "absolute", top: 4, left: 0, fontSize: 9, color: "#8A9099", fontWeight: 600, letterSpacing: 0.5 }}>MACD</div>
    </div>
  );
}
