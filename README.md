# Thai Stock AI — Frontend

Mobile-first Thai SET stock analysis and AI forecasting app built with Next.js 15. Designed as an Android-style phone UI in the browser, with bilingual Thai + English labels throughout.

**Live:** https://frontend-runtome.vercel.app

## Features

- **SET market overview** — index hero with sparkline, advancers/decliners, sector heatmap, top movers carousel
- **Stock detail** — candlestick chart + MA20/MA50 overlays, volume bars, RSI 14, MACD, OHLC strip, technical signal cards
- **AI Forecast** — XGBoost / Random Forest / ARIMA model selector, 7–180 day horizon, confidence cone chart, confidence ring, 7-day price strip
- **Forecast Settings** — stock picker, model radio, horizon segmented control, training window slider, feature toggles, risk tolerance
- **Watchlist & Portfolio** — persistent watchlist (localStorage), portfolio allocation bar
- **Dark / Light theme** — instant CSS variable swap via `data-theme` on `<html>`, zero JS re-render
- **Mock-first** — all screens work without a backend; set `HF_SPACE_URL` to switch to live data

## Screens

| Route | Screen |
|-------|--------|
| `/markets` | SET Index hero, AI outlook banner, top movers, sector heatmap, all stocks |
| `/search` | Debounced search, recent stocks with sparklines, sector chips |
| `/stocks/[symbol]` | Candlestick + MA, volume, RSI, MACD, signal cards |
| `/stocks/[symbol]/forecast` | AI forecast chart, confidence ring, direction verdict, 7-day strip |
| `/forecast-settings` | Model & horizon config, Run Forecast button |
| `/watchlist` | Saved stocks with live prices and AI direction |
| `/portfolio` | Total value, allocation bar, positions list |

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Charts | `lightweight-charts` v5 (candlestick / volume / RSI / MACD), custom SVG (sparkline, forecast cone, heatmap, confidence ring) |
| Fonts | IBM Plex Mono via `next/font/google` (prices); system-ui for UI text |
| State | React Context (theme + forecast settings) |
| Backend | Next.js API routes proxy to HF Space; falls back to mock data when `HF_SPACE_URL` is unset |

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — the app runs entirely on mock data with no backend required.

## Connecting to the Backend

Copy `.env.example` to `.env.local` and set your HF Space URL:

```bash
cp .env.example .env.local
```

```env
HF_SPACE_URL=https://suphot-thai-stock-ai-backend.hf.space
HF_SPACE_TOKEN=          # leave empty for public spaces
```

Next.js API routes at `/api/...` proxy all requests to the HF Space internally, so the token never reaches the browser and there are no CORS issues.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Fonts, ThemeProvider, ForecastProvider
│   ├── globals.css                   # Tailwind v4 @theme design tokens
│   ├── markets/page.tsx
│   ├── search/page.tsx
│   ├── stocks/[symbol]/page.tsx
│   ├── stocks/[symbol]/forecast/page.tsx
│   ├── forecast-settings/page.tsx
│   ├── watchlist/page.tsx
│   ├── portfolio/page.tsx
│   └── api/                          # Proxy routes → HF Space / mock fallback
├── components/
│   ├── layout/                       # PhoneFrame, AppShell, BottomTabBar, TopBar
│   ├── charts/                       # CandlestickChart, VolumeChart, RSIChart,
│   │                                 # MACDChart, SparklineChart, ForecastChart,
│   │                                 # SectorHeatmap, ConfidenceRing
│   ├── stock-detail/StockCharts.tsx  # "use client" wrapper for dynamic chart imports
│   └── ui/                           # Chip, Card, Skeleton, SegmentedControl, ...
└── lib/
    ├── api/                          # hf-client.ts, stocks-api.ts, forecast-api.ts
    ├── mock/                         # Deterministic mock data (seeded LCG)
    ├── context/                      # ThemeContext, ForecastContext
    ├── hooks/                        # useWatchlist
    ├── types/                        # stock.ts, forecast.ts, market.ts, portfolio.ts
    └── utils/                        # format.ts, date.ts, color.ts
```

## Design System

Dark mode by default. All tokens are CSS custom properties defined in `globals.css`:

| Token | Dark | Light |
|-------|------|-------|
| `--color-bg` | `#0B0E13` | `#FAFAF7` |
| `--color-panel` | `#151920` | `#FFFFFF` |
| `--color-ink` | `#F5F5F0` | `#0F1419` |
| `--color-up` | `oklch(0.74 0.17 145)` | same |
| `--color-down` | `oklch(0.70 0.20 25)` | same |
| `--color-ai` | `oklch(0.72 0.16 285)` | same |

Toggle `data-theme="light"` on `<html>` to switch themes instantly.

## Chart Notes

All Lightweight Charts components use `await import('lightweight-charts')` inside `useEffect` only (never at module level) to avoid SSR errors. They are wrapped in `StockCharts.tsx` (`"use client"`) using `next/dynamic` with `ssr: false`.

Lightweight Charts v5 API: `chart.addSeries(CandlestickSeries, {...})` — not the v4 `chart.addCandlestickSeries()`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_SPACE_URL` | No | Backend URL (e.g. `https://suphot-thai-stock-ai-backend.hf.space`). Unset = mock data. |
| `HF_SPACE_TOKEN` | No | Bearer token for private HF Spaces. Leave empty for public spaces. |

## Build & Deploy

```bash
npm run build    # production build
npm run start    # start production server locally
```

Deployed to Vercel. Connect the GitHub repo and Vercel auto-deploys on every push to `master`. Set `HF_SPACE_URL` in Vercel → Project → Settings → Environment Variables.

## Backend

The FastAPI backend lives in `../backend/`. See [`../backend/README.md`](../backend/README.md) for setup, endpoints, and Docker instructions.
