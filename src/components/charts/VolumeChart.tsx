"use client";
import { useEffect, useRef } from "react";
import type { OHLCV } from "@/lib/types/stock";

interface VolumeChartProps {
  data: OHLCV[];
  height?: number;
}

export function VolumeChart({ data, height = 80 }: VolumeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;
    let chart: import("lightweight-charts").IChartApi | null = null;

    (async () => {
      const { createChart, ColorType, HistogramSeries } = await import("lightweight-charts");
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8A9099", fontSize: 10 },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0 } },
        timeScale: { borderVisible: false, visible: false },
        handleScroll: false,
        handleScale: false,
      });

      const volSeries = chart.addSeries(HistogramSeries, {
        color: "#5C636E",
        priceFormat: { type: "volume" },
      });

      volSeries.setData(
        data.map((d) => ({
          time: d.date as import("lightweight-charts").Time,
          value: d.volume,
          color: d.close >= d.open ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)",
        }))
      );

      chart.timeScale().fitContent();
    })();

    return () => { chart?.remove(); };
  }, [data, height]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
}
