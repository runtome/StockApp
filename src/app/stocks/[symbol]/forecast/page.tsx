"use client";
import { use, useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { ConfidenceRing } from "@/components/charts/ConfidenceRing";
import { useForecast } from "@/lib/context/ForecastContext";
import type { ForecastResponse, ModelType } from "@/lib/types/forecast";
import type { OHLCV } from "@/lib/types/stock";
import Link from "next/link";

const MODELS: ModelType[] = ["XGBoost", "LSTM", "Random Forest", "Prophet", "ARIMA"];
const HISTORY_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "14D", days: 14 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
];

function DirectionBadge({ direction }: { direction: string }) {
  const isUp = direction.toLowerCase().includes("up");
  const isDown = direction.toLowerCase().includes("down");
  const color = isUp ? "var(--color-up)" : isDown ? "var(--color-down)" : "var(--color-warn)";
  const bg = isUp ? "var(--color-up-bg)" : isDown ? "var(--color-down-bg)" : "rgba(120,80,0,0.15)";
  const arrow = isUp ? "↑" : isDown ? "↓" : "→";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 18, color }}>{arrow}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color, background: bg, padding: "2px 10px", borderRadius: 20 }}>
        {direction}
      </span>
    </div>
  );
}

export default function ForecastPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = use(params);
  const sym = rawSymbol.toUpperCase();
  const { settings, updateSetting } = useForecast();

  const [activeModel, setActiveModel] = useState<ModelType>(settings.model);
  const [historyDays, setHistoryDays] = useState(30);
  const [history, setHistory] = useState<OHLCV[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Load history
  useEffect(() => {
    fetch(`/api/stocks/${sym}/history?days=${historyDays}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.data ?? []))
      .catch(() => {});
  }, [sym, historyDays]);

  // Run forecast
  const runForecast = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: sym,
          model: activeModel,
          horizon: settings.horizon,
          training_days: settings.trainingDays,
          features: settings.features,
          risk_tolerance: settings.riskTolerance,
        }),
      });
      setForecast(await res.json());
    } catch {}
    setLoading(false);
  }, [sym, activeModel, settings]);

  useEffect(() => { runForecast(); }, [runForecast]);

  const handleModelChange = (m: ModelType) => {
    setActiveModel(m);
    updateSetting("model", m);
  };

  const lastPrice = history.length ? history[history.length - 1].close : 0;
  const forecastedPrice = forecast?.predictions?.[forecast.predictions.length - 1]?.price ?? lastPrice;
  const priceChange = lastPrice ? ((forecastedPrice - lastPrice) / lastPrice) * 100 : 0;

  return (
    <AppShell>
      <TopBar
        backHref={`/stocks/${sym}`}
        rightSlot={
          <Link href="/forecast-settings" style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", background: "var(--color-chip)", borderRadius: 8, textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)" }}>Settings</span>
          </Link>
        }
      />

      <div style={{ paddingBottom: 16 }}>
        {/* Header */}
        <div style={{ padding: "12px 20px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--color-ai)", fontWeight: 600, letterSpacing: 0.4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            AI FORECAST · การคาดการณ์
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, marginTop: 2, color: "var(--color-ink)" }}>{sym}</div>
        </div>

        {/* Model selector */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.5, marginBottom: 8 }}>MODEL · โมเดล</div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => handleModelChange(m)}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: activeModel === m ? "var(--color-ai)" : "var(--color-chip)",
                  color: activeModel === m ? "var(--color-bg)" : "var(--color-chip-ink)",
                  transition: "background 0.15s",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* History range */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.5, marginBottom: 8 }}>HISTORY RANGE</div>
          <div style={{ display: "flex", gap: 6 }}>
            {HISTORY_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setHistoryDays(opt.days)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  background: historyDays === opt.days ? "var(--color-panel-alt)" : "var(--color-chip)",
                  color: historyDays === opt.days ? "var(--color-ink)" : "var(--color-muted)",
                  outline: historyDays === opt.days ? "1px solid var(--color-ai)" : "none",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast chart */}
        <Card style={{ margin: "0 16px 16px", padding: "12px 12px 8px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 13, color: "var(--color-muted)" }}>Computing forecast…</div>
            </div>
          ) : (
            <ForecastChart history={history} predictions={forecast?.predictions ?? []} height={160} />
          )}
        </Card>

        {/* Verdict + confidence */}
        {forecast && (
          <Card style={{ margin: "0 16px 16px", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ConfidenceRing confidence={forecast.confidence} direction={forecast.direction} size={88} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.5, marginBottom: 6 }}>7-DAY DIRECTION</div>
                <DirectionBadge direction={forecast.direction} />
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--color-muted)", fontWeight: 600 }}>CURRENT</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{lastPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--color-muted)", fontWeight: 600 }}>TARGET (+7d)</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: priceChange >= 0 ? "var(--color-up)" : "var(--color-down)" }}>
                      {forecastedPrice.toFixed(2)} ({priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 7-day strip */}
        {forecast?.predictions && (
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>7-Day Forecast Strip</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="no-scrollbar">
              {forecast.predictions.map((p, i) => {
                const dayChange = lastPrice ? ((p.price - lastPrice) / lastPrice) * 100 : 0;
                const isUp = dayChange >= 0;
                const d = new Date(p.date);
                const label = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
                return (
                  <div key={i} style={{ flexShrink: 0, background: "var(--color-panel)", border: "1px solid var(--color-hairline)", borderRadius: 10, padding: "8px 10px", textAlign: "center", minWidth: 72 }}>
                    <div style={{ fontSize: 9, color: "var(--color-muted)", marginBottom: 4 }}>Day {i + 1}</div>
                    <div style={{ fontSize: 9, color: "var(--color-muted2)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--color-ink)" }}>{p.price.toFixed(2)}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: isUp ? "var(--color-up)" : "var(--color-down)", fontWeight: 600, marginTop: 2 }}>
                      {isUp ? "+" : ""}{dayChange.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reasons */}
        {forecast?.reasons && forecast.reasons.length > 0 && (
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-ink)", marginBottom: 8 }}>Why this forecast · เหตุผล</div>
            <Card style={{ padding: "4px 0" }}>
              {forecast.reasons.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-ai)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--color-ink2)" }}>{r}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ margin: "0 16px 16px", padding: "10px 14px", background: "var(--color-panel-alt)", borderRadius: 10, fontSize: 10, color: "var(--color-muted)", lineHeight: 1.6 }}>
          {forecast?.disclaimer ?? "This forecast is for educational and analytical purposes only. It is not financial advice. Invest at your own risk."}
        </div>
      </div>
    </AppShell>
  );
}
