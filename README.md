# Thai Stock AI — Frontend

Mobile-first Thai SET stock analysis and AI forecasting app built with Next.js. Designed as an Android-style phone UI in the browser, with bilingual Thai + English labels throughout.

**Live:** https://frontend-runtome.vercel.app

---

## Features

- **SET market overview** — index hero with sparkline, advancers/decliners, sector heatmap, top movers carousel
- **Stock detail** — candlestick chart + MA20/MA50 overlays, volume bars, RSI 14, MACD, OHLC strip, technical signal cards
- **AI Forecast** — XGBoost / Random Forest / ARIMA model selector, 7–180 day horizon, confidence cone chart, confidence ring, 7-day price strip
- **Forecast Settings** — stock picker, model radio, horizon segmented control, training window slider, feature toggles, risk tolerance
- **Watchlist** — persistent watchlist stored in localStorage with live prices and AI direction
- **Portfolio** — MongoDB-backed positions with live P&L, allocation bar, add/remove positions
- **Auth** — register with name/email/password, bcrypt-hashed via backend, JWT stored in localStorage
- **Dark / Light theme** — instant CSS variable swap, zero JS re-render
- **Mock-first** — all screens work without a backend; set `HF_SPACE_URL` to switch to live data

---

## Screens

| Route | Screen |
|-------|--------|
| `/markets` | SET Index hero, AI outlook banner, top movers, sector heatmap, all stocks |
| `/search` | Debounced search, recent stocks with sparklines, sector chips |
| `/stocks/[symbol]` | Candlestick + MA, volume, RSI, MACD, signal cards |
| `/stocks/[symbol]/forecast` | AI forecast chart, confidence ring, direction verdict, 7-day strip |
| `/forecast-settings` | Model & horizon config, Run Forecast button |
| `/watchlist` | Saved stocks with live prices and AI direction |
| `/portfolio` | Live P&L, allocation bar, positions from MongoDB, add/remove positions |
| `/login` | Email + password sign-in |
| `/register` | Account creation with terms and cookie consent |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Charts | `lightweight-charts` v5 (candlestick / volume / RSI / MACD), custom SVG (sparkline, forecast cone, heatmap, confidence ring) |
| Fonts | IBM Plex Mono via `next/font/google` (prices); system-ui for UI text |
| State | React Context — `ThemeContext`, `ForecastContext`, `AuthContext` |
| Auth | JWT stored in localStorage; `AuthContext` provides `user`, `token`, `login`, `logout` |
| Backend | Next.js API routes proxy to HF Space; falls back to mock data when `HF_SPACE_URL` is unset |

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — the app runs entirely on mock data with no backend required. Login and portfolio features require the backend to be running with `MONGODB_URL` configured.

---

## Connecting to the Backend

Copy `.env.example` to `.env.local` and set your HF Space URL:

```bash
cp .env.example .env.local
```

```env
HF_SPACE_URL=https://suphot-thai-stock-ai-backend.hf.space
HF_SPACE_TOKEN=          # leave empty for public spaces
```

Next.js API routes at `/api/...` proxy all requests to the HF Space server-side, so the token never reaches the browser and there are no CORS issues.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_SPACE_URL` | No | Backend URL (e.g. `https://suphot-thai-stock-ai-backend.hf.space`). Unset = mock data. |
| `HF_SPACE_TOKEN` | No | Bearer token for private HF Spaces. Leave empty for public spaces. |
| `NEXT_PUBLIC_APP_NAME` | No | App name shown in metadata (default: `Thai Stock AI`) |
| `NEXT_PUBLIC_DEFAULT_THEME` | No | Default colour theme: `dark` or `light` (default: `dark`) |

Set these in **Vercel → Project → Settings → Environment Variables** for production.

---

## Auth Flow

1. User registers at `/register` → frontend POSTs to `/api/auth/register` → proxied to HF Space `/auth/register`
2. Backend hashes password with bcrypt (12 rounds), stores in MongoDB, returns a signed JWT
3. JWT is stored in `localStorage` and included as `Authorization: Bearer <token>` on all portfolio requests
4. `AuthContext` re-hydrates from `localStorage` on page load — no flash of unauthenticated state
5. Logout clears `localStorage` and resets context state

---

## Portfolio Flow

1. Signed-in user visits `/portfolio`
2. Page fetches `GET /api/portfolio` with the JWT → proxied to HF Space
3. Backend retrieves MongoDB positions, enriches each with a live yfinance price, and returns computed P&L
4. User can add positions via the bottom sheet (symbol, shares, avg cost)
5. User can remove any position with the × button

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Fonts, ThemeProvider, AuthProvider, ForecastProvider
│   ├── globals.css                   # Tailwind v4 @theme design tokens
│   ├── page.tsx                      # Redirect → /markets
│   ├── markets/page.tsx
│   ├── search/page.tsx
│   ├── stocks/[symbol]/page.tsx
│   ├── stocks/[symbol]/forecast/page.tsx
│   ├── forecast-settings/page.tsx
│   ├── watchlist/page.tsx
│   ├── portfolio/page.tsx            # Client component — DB portfolio + add/remove positions
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts     # POST → HF Space /auth/register
│       │   └── login/route.ts        # POST → HF Space /auth/login
│       ├── portfolio/
│       │   ├── route.ts              # GET (fetch) / POST (add position) → HF Space /portfolio
│       │   └── positions/[symbol]/
│       │       └── route.ts          # DELETE → HF Space /portfolio/positions/{symbol}
│       ├── stocks/route.ts
│       ├── stocks/[symbol]/route.ts
│       ├── stocks/[symbol]/history/route.ts
│       ├── stocks/[symbol]/indicators/route.ts
│       ├── forecast/route.ts
│       └── market/summary/route.ts
├── components/
│   ├── layout/
│   │   ├── PhoneFrame.tsx            # 390×844 px centred frame + Android shadow
│   │   ├── AppShell.tsx              # PhoneFrame + BottomTabBar wrapper
│   │   ├── BottomTabBar.tsx          # 5-tab nav; shows user avatar or Sign-in chip
│   │   └── TopBar.tsx                # Back button, title, theme toggle, rightSlot
│   ├── charts/
│   │   ├── SparklineChart.tsx        # Pure SVG (SSR safe)
│   │   ├── CandlestickChart.tsx      # dynamic import lightweight-charts
│   │   ├── VolumeChart.tsx
│   │   ├── RSIChart.tsx
│   │   ├── MACDChart.tsx
│   │   ├── ForecastChart.tsx         # SVG history + forecast cone + confidence ring
│   │   └── SectorHeatmap.tsx         # CSS grid coloured divs (SSR safe)
│   ├── stock-detail/StockCharts.tsx  # "use client" wrapper for dynamic chart imports
│   └── ui/                           # Chip, Card, Skeleton, SegmentedControl, CookieBanner, ...
└── lib/
    ├── api/
    │   ├── hf-client.ts              # fetchHF() helper — server-side proxy to HF Space
    │   ├── auth-api.ts               # apiRegister(), apiLogin() — client-side calls to /api/auth/*
    │   ├── stocks-api.ts
    │   └── forecast-api.ts
    ├── mock/                         # Deterministic mock data (seeded LCG, no hydration mismatch)
    ├── context/
    │   ├── ThemeContext.tsx           # data-theme on <html>, CSS variable swap
    │   ├── ForecastContext.tsx        # forecast settings state
    │   └── AuthContext.tsx            # JWT + user state, login/logout helpers
    ├── hooks/                        # useWatchlist
    ├── types/                        # stock.ts, forecast.ts, market.ts, portfolio.ts
    └── utils/                        # format.ts, date.ts, color.ts
```

---

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

---

## Chart Notes

All Lightweight Charts components use `await import('lightweight-charts')` inside `useEffect` only (never at module level) to avoid SSR errors. They are wrapped in `StockCharts.tsx` (`"use client"`) using `next/dynamic` with `ssr: false`.

Lightweight Charts v5 API: `chart.addSeries(CandlestickSeries, {...})` — not the v4 `chart.addCandlestickSeries()`.

---

## Build & Deploy

```bash
npm run build    # production build — verifies zero SSR errors
npm run start    # start production server locally
```

Deployed to Vercel. Connect the GitHub repo and Vercel auto-deploys on every push to `master`. Set `HF_SPACE_URL` in **Vercel → Project → Settings → Environment Variables**.

---

## Backend

The FastAPI backend lives in `../backend/`. See [`../backend/README.md`](../backend/README.md) for setup, endpoints, MongoDB configuration, and Docker instructions.
