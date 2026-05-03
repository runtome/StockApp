"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useForecast } from "@/lib/context/ForecastContext";
import type { ModelType, RiskTolerance } from "@/lib/types/forecast";
import { MOCK_STOCKS } from "@/lib/mock/stocks";

const MODELS: { id: ModelType; desc: string }[] = [
  { id: "XGBoost", desc: "Gradient boosting — fast, accurate on tabular data" },
  { id: "LSTM", desc: "Neural network — captures long-term patterns" },
  { id: "Random Forest", desc: "Ensemble method — robust and interpretable" },
  { id: "Prophet", desc: "Time-series decomposition — handles seasonality" },
  { id: "ARIMA", desc: "Statistical model — classical time series" },
];

const HORIZON_OPTIONS = [
  { value: "1", label: "1d" },
  { value: "3", label: "3d" },
  { value: "5", label: "5d" },
  { value: "7", label: "7d" },
  { value: "14", label: "14d" },
  { value: "30", label: "30d" },
];

const FEATURE_OPTIONS = ["MA", "RSI", "MACD", "Bollinger", "Volume", "SET Index"];

const RISK_OPTIONS: { value: RiskTolerance; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function ForecastSettingsPage() {
  const router = useRouter();
  const { settings, updateSetting, setSettings } = useForecast();

  const [stockSearch, setStockSearch] = useState("");
  const filteredStocks = MOCK_STOCKS.filter(
    (s) => s.symbol.toLowerCase().includes(stockSearch.toLowerCase()) || s.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const toggleStock = (sym: string) => {
    const current = settings.selectedStocks;
    if (current.includes(sym)) {
      updateSetting("selectedStocks", current.filter((s) => s !== sym));
    } else {
      updateSetting("selectedStocks", [...current, sym]);
    }
  };

  const toggleFeature = (f: string) => {
    const current = settings.features;
    if (current.includes(f)) {
      updateSetting("features", current.filter((x) => x !== f));
    } else {
      updateSetting("features", [...current, f]);
    }
  };

  const handleReset = () => {
    setSettings({
      selectedStocks: ["AOT"],
      model: "XGBoost",
      horizon: 7,
      trainingDays: 365,
      features: ["MA", "RSI", "MACD", "Bollinger", "Volume"],
      riskTolerance: "medium",
    });
  };

  const handleRun = () => {
    const sym = settings.selectedStocks[0] ?? "AOT";
    router.push(`/stocks/${sym}/forecast`);
  };

  const Section = ({ title }: { title: string }) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.6, padding: "20px 0 8px" }}>
      {title.toUpperCase()}
    </div>
  );

  return (
    <AppShell>
      <TopBar backHref={`/stocks/${settings.selectedStocks[0] ?? "AOT"}/forecast`} title="Forecast Settings · ตั้งค่า" />
      <div style={{ padding: "0 16px 100px" }}>

        {/* Stock picker */}
        <Section title="Stocks · หุ้น" />
        {settings.selectedStocks.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {settings.selectedStocks.map((sym) => (
              <div key={sym} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "var(--color-ai-bg)", borderRadius: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ai-ink)" }}>{sym}</span>
                <button onClick={() => toggleStock(sym)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ai)", padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Search stocks..."
          value={stockSearch}
          onChange={(e) => setStockSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "var(--color-panel)",
            border: "1px solid var(--color-hairline)",
            borderRadius: 10,
            color: "var(--color-ink)",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 8,
          }}
        />
        <Card style={{ overflow: "hidden" }}>
          {filteredStocks.slice(0, 8).map((s, i) => {
            const selected = settings.selectedStocks.includes(s.symbol);
            return (
              <div key={s.symbol}>
                {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
                <button
                  onClick={() => toggleStock(s.symbol)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${selected ? "var(--color-ai)" : "var(--color-muted)"}`, background: selected ? "var(--color-ai)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{s.name}</div>
                  </div>
                </button>
              </div>
            );
          })}
        </Card>

        {/* Model */}
        <Section title="Model · โมเดล" />
        <Card style={{ overflow: "hidden" }}>
          {MODELS.map((m, i) => {
            const active = settings.model === m.id;
            return (
              <div key={m.id}>
                {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
                <button
                  onClick={() => updateSetting("model", m.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? "var(--color-ai)" : "var(--color-muted)"}`, background: active ? "var(--color-ai)" : "transparent", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{m.id}</div>
                    <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{m.desc}</div>
                  </div>
                </button>
              </div>
            );
          })}
        </Card>

        {/* Forecast horizon */}
        <Section title="Forecast Horizon · ช่วงเวลา" />
        <SegmentedControl
          options={HORIZON_OPTIONS}
          value={String(settings.horizon)}
          onChange={(v) => updateSetting("horizon", parseInt(v))}
        />

        {/* Training history */}
        <Section title="Training History · ข้อมูลย้อนหลัง" />
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "var(--color-ink)" }}>Training days</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-ai)", fontWeight: 600 }}>{settings.trainingDays}d</span>
          </div>
          <input
            type="range"
            min={30}
            max={730}
            step={30}
            value={settings.trainingDays}
            onChange={(e) => updateSetting("trainingDays", parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "var(--color-ai)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "var(--color-muted2)" }}>30d</span>
            <span style={{ fontSize: 10, color: "var(--color-muted2)" }}>730d</span>
          </div>
        </Card>

        {/* Features */}
        <Section title="Features · ตัวแปร" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FEATURE_OPTIONS.map((f) => {
            const active = settings.features.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: active ? "var(--color-ai)" : "var(--color-chip)",
                  color: active ? "var(--color-bg)" : "var(--color-chip-ink)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Risk tolerance */}
        <Section title="Risk Tolerance · ระดับความเสี่ยง" />
        <SegmentedControl
          options={RISK_OPTIONS}
          value={settings.riskTolerance}
          onChange={(v) => updateSetting("riskTolerance", v as RiskTolerance)}
        />

        {/* Submit bar */}
        <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
          <button
            onClick={handleReset}
            style={{ flex: 1, padding: "14px", borderRadius: 14, border: "1px solid var(--color-hairline)", background: "var(--color-panel)", color: "var(--color-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Reset
          </button>
          <button
            onClick={handleRun}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: "var(--color-ai)", color: "var(--color-bg)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Run Forecast · เริ่ม
          </button>
        </div>
      </div>
    </AppShell>
  );
}
