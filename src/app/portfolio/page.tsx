"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useAuth } from "@/lib/context/AuthContext";
import type { Portfolio, Position } from "@/lib/types/portfolio";

const KNOWN_STOCKS: Record<string, string> = {
  PTT: "PTT Public Company", AOT: "Airports of Thailand", CPALL: "CP All",
  KBANK: "Kasikornbank", ADVANC: "Advanced Info Service", SCB: "SCBX",
  BDMS: "Bangkok Dusit Medical", GULF: "Gulf Energy Development",
  SCC: "Siam Cement Group", DELTA: "Delta Electronics",
  CPF: "Charoen Pokphand Foods", MINT: "Minor International",
  TRUE: "True Corporation", BBL: "Bangkok Bank", KTB: "Krungthai Bank",
};

const COLORS = ["var(--color-ai)", "var(--color-up)", "var(--color-warn)", "var(--color-down)"];

const INPUT: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13,
  background: "var(--color-bg)", border: "1px solid var(--color-hairline)",
  color: "var(--color-ink)", outline: "none", boxSizing: "border-box",
};

function AllocationBar({ positions }: { positions: Position[] }) {
  return (
    <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", gap: 1 }}>
      {positions.map((p, i) => (
        <div key={p.symbol} style={{ flex: p.allocation_pct, background: COLORS[i % COLORS.length], borderRadius: 2 }} />
      ))}
    </div>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: "var(--color-chip)", border: "none", borderRadius: 20,
        padding: "5px 10px", cursor: "pointer", color: "var(--color-muted)",
        fontSize: 11, fontWeight: 600,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign out
    </button>
  );
}

export default function PortfolioPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addSymbol, setAddSymbol] = useState("");
  const [addName, setAddName] = useState("");
  const [addShares, setAddShares] = useState("");
  const [addCost, setAddCost] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load");
      setPortfolio(await res.json());
    } catch {
      setError("Could not load portfolio data.");
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && token) fetchPortfolio();
  }, [authLoading, token, fetchPortfolio]);

  async function handleAddPosition(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setAddLoading(true);
    try {
      const sym = addSymbol.toUpperCase().trim();
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          symbol: sym,
          name: addName.trim() || KNOWN_STOCKS[sym] || sym,
          shares: parseFloat(addShares),
          avg_cost: parseFloat(addCost),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setShowAdd(false);
      setAddSymbol(""); setAddName(""); setAddShares(""); setAddCost("");
      await fetchPortfolio();
    } catch {
      // keep sheet open so user can retry
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete(symbol: string) {
    if (!token) return;
    try {
      await fetch(`/api/portfolio/positions/${symbol}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      await fetchPortfolio();
    } catch {}
  }

  // Not logged in
  if (!authLoading && !user) {
    return (
      <AppShell>
        <TopBar title="Portfolio · พอร์ต" showThemeToggle />
        <div style={{ padding: 16 }}>
          <Card style={{ padding: 28, textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-ink)", marginBottom: 6 }}>Track your portfolio</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", lineHeight: 1.6, marginBottom: 18 }}>
              Sign in to save positions and track performance with live prices · เข้าสู่ระบบเพื่อติดตามพอร์ต
            </div>
            <Link href="/login"
              style={{ display: "block", padding: "13px", background: "var(--color-ai)", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Sign In · เข้าสู่ระบบ
            </Link>
          </Card>
        </div>
      </AppShell>
    );
  }

  const p = portfolio;
  const isUp = (p?.total_gain_loss ?? 0) >= 0;

  return (
    <AppShell>
      <TopBar
        title="Portfolio · พอร์ต"
        showThemeToggle
        rightSlot={<LogoutButton onLogout={logout} />}
      />
      <div style={{ padding: 16 }}>

        {/* Loading skeleton */}
        {(authLoading || (fetching && !p)) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[80, 60, 60, 60].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 12, background: "var(--color-chip)", opacity: 0.4 }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "var(--color-down-bg)", borderRadius: 10, fontSize: 13, color: "var(--color-down)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button onClick={fetchPortfolio}
              style={{ background: "none", border: "none", color: "var(--color-ai)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {p && p.positions.length === 0 && (
          <Card style={{ padding: 28, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink)", marginBottom: 6 }}>No positions yet</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 18 }}>
              Add your first stock position to start tracking performance.
            </div>
            <button onClick={() => setShowAdd(true)}
              style={{ padding: "11px 24px", background: "var(--color-ai)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              + Add Position
            </button>
          </Card>
        )}

        {/* Summary card */}
        {p && p.positions.length > 0 && (
          <>
            <Card style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.5 }}>TOTAL VALUE</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--color-ink)", marginTop: 4, letterSpacing: -0.5 }}>
                ฿{(p.total_value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <Chip
                  label={`${isUp ? "+" : ""}฿${Math.abs(p.total_gain_loss ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                  variant={isUp ? "up" : "down"}
                />
                <Chip
                  label={`${isUp ? "+" : ""}${(p.total_gain_loss_pct ?? 0).toFixed(2)}%`}
                  variant={isUp ? "up" : "down"}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 6 }}>Allocation</div>
                <AllocationBar positions={p.positions} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {p.positions.map((pos, i) => (
                    <div key={pos.symbol} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 10, color: "var(--color-muted)" }}>{pos.symbol} {pos.allocation_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Positions header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>Positions · รายการ</div>
              <button onClick={() => setShowAdd(true)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--color-ai)", border: "none", borderRadius: 20, padding: "5px 12px", cursor: "pointer", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                + Add
              </button>
            </div>

            {/* Positions list */}
            <Card style={{ overflow: "hidden" }}>
              {p.positions.map((pos, i) => {
                const isGain = (pos.gain_loss ?? 0) >= 0;
                return (
                  <div key={pos.symbol}>
                    {i > 0 && <div style={{ height: 1, background: "var(--color-hairline)", margin: "0 16px" }} />}
                    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{pos.symbol}</div>
                            <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 1 }}>
                              {(pos.shares ?? 0).toLocaleString()} shares @ ฿{(pos.avg_cost ?? 0).toFixed(2)}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>
                              ฿{(pos.value ?? 0).toLocaleString("en-US")}
                            </div>
                            <Chip
                              label={`${isGain ? "+" : ""}${(pos.gain_loss_pct ?? 0).toFixed(2)}%`}
                              variant={isGain ? "up" : "down"}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(pos.symbol)}
                        title="Remove position"
                        style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-chip)", border: "none", cursor: "pointer", color: "var(--color-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </Card>

            <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--color-panel)", borderRadius: 10, border: "1px solid var(--color-hairline)", fontSize: 11, color: "var(--color-muted)", lineHeight: 1.5 }}>
              Prices update every 5 minutes. For analysis only — not financial advice.
            </div>
          </>
        )}
      </div>

      {/* Add Position sheet */}
      {showAdd && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}
        >
          <div style={{ background: "var(--color-panel)", borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", borderTop: "1px solid var(--color-hairline)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink)" }}>Add Position</div>
              <button onClick={() => setShowAdd(false)}
                style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-chip)", border: "none", cursor: "pointer", color: "var(--color-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddPosition} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", marginBottom: 5 }}>SYMBOL</div>
                  <input
                    style={INPUT}
                    value={addSymbol}
                    onChange={(e) => {
                      const sym = e.target.value.toUpperCase();
                      setAddSymbol(sym);
                      if (KNOWN_STOCKS[sym]) setAddName(KNOWN_STOCKS[sym]);
                    }}
                    placeholder="AOT"
                    required
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", marginBottom: 5 }}>SHARES</div>
                  <input
                    style={INPUT}
                    type="number" min="0" step="any"
                    value={addShares}
                    onChange={(e) => setAddShares(e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", marginBottom: 5 }}>COMPANY NAME (optional)</div>
                <input
                  style={INPUT}
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Airports of Thailand"
                />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", marginBottom: 5 }}>AVG COST (฿ per share)</div>
                <input
                  style={INPUT}
                  type="number" min="0" step="any"
                  value={addCost}
                  onChange={(e) => setAddCost(e.target.value)}
                  placeholder="52.50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={addLoading}
                style={{ marginTop: 4, padding: "13px", background: addLoading ? "var(--color-muted2)" : "var(--color-ai)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: addLoading ? "not-allowed" : "pointer" }}
              >
                {addLoading ? "Adding..." : "Add to Portfolio · เพิ่มหุ้น"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
