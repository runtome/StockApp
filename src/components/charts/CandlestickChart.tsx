"use client";
import { useEffect, useRef } from "react";
import type { OHLCV } from "@/lib/types/stock";

interface CandlestickChartProps {
  data: OHLCV[];
  ma20?: number[];
  ma50?: number[];
  height?: number;
}

export function CandlestickChart({ data, ma20, ma50, height = 200 }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    let chart: import("lightweight-charts").IChartApi | null = null;

    (async () => {
      const lc = await import("lightweight-charts");
      const { createChart, ColorType, LineStyle, CandlestickSeries, LineSeries } = lc;
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#8A9099",
          fontSize: 11,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: "rgba(255,255,255,0.04)", style: LineStyle.Solid },
        },
        crosshair: {
          vertLine: { color: "#5C636E", width: 1, style: LineStyle.Dashed },
          horzLine: { color: "#5C636E", width: 1, style: LineStyle.Dashed },
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: { borderVisible: false, barSpacing: 6 },
        handleScroll: true,
        handleScale: true,
      });

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "oklch(0.74 0.17 145)",
        downColor: "oklch(0.70 0.20 25)",
        borderUpColor: "oklch(0.74 0.17 145)",
        borderDownColor: "oklch(0.70 0.20 25)",
        wickUpColor: "oklch(0.74 0.17 145)",
        wickDownColor: "oklch(0.70 0.20 25)",
      });

      candleSeries.setData(
        data.map((d) => ({
          time: d.date as import("lightweight-charts").Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );

      if (ma20 && ma20.length === data.length) {
        const ma20Series = chart.addSeries(LineSeries, {
          color: "rgba(251,191,36,0.85)",
          lineWidth: 1,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });
        ma20Series.setData(
          data
            .map((d, i) => ({ time: d.date as import("lightweight-charts").Time, value: ma20[i] }))
            .filter((p) => p.value > 0)
        );
      }

      if (ma50 && ma50.length === data.length) {
        const ma50Series = chart.addSeries(LineSeries, {
          color: "rgba(167,139,250,0.85)",
          lineWidth: 1,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });
        ma50Series.setData(
          data
            .map((d, i) => ({ time: d.date as import("lightweight-charts").Time, value: ma50[i] }))
            .filter((p) => p.value > 0)
        );
      }

      chart.timeScale().fitContent();

      const observer = new ResizeObserver(() => {
        if (containerRef.current && chart) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      observer.observe(containerRef.current);
    })();

    return () => {
      chart?.remove();
    };
  }, [data, ma20, ma50, height]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
}
