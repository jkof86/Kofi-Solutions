# 📘 Kofi Solutions Dashboard — v1.141

A modular, real-time, single-page dashboard built with **React**, **MUI**, **AWS Lambda**, and **API Gateway**, featuring:

- Live crypto + finance tickers
- Feed health monitoring
- Recharts-powered market snapshots
- Multi-category RSS + JSON aggregation
- Responsive, branded UI shell
- Local test-mode authentication
- Fully normalized backend FEEDS map

## 🚀 Features

### 🔷 HeaderShell (Fixed Header + Banner + Ticker)

- Fully responsive fixed header
- Auto-measured height using ResizeObserver
- Branded banner section
- Live ticker row (BTC, ETH, SOL, AAPL, MSFT, AMZN)
- Drawer navigation with external + internal links

### 🔷 MainBar

- Secondary navigation bar
- Used across Login, Register, and other standalone pages
- Supports custom banner insertion

### 🔷 FeedHealthDashboard

Displays the health of every backend feed:

- **ok** → green
- **error** → red
- **degraded / fallback** → yellow
- **json** → treated as OK
- Fully normalized against backend FEEDS map

### 🔷 MarketChart (Recharts Integrated)

- 1-day snapshot (price + % change)
- Live chart using CoinGecko market data
- ResponsiveContainer for perfect scaling
- Smooth line animations
- Graceful fallback UI

## 🏗️ Architecture Overview

### Frontend

- React 18
- Material UI (MUI v5)
- Recharts
- React Router
- LocalStorage-based test authentication
- Modular components:
  - HeaderShell
  - MainBar
  - FeedHealthDashboard
  - MarketChart
  - RSSFeed
  - FeedCard
  - Home (main dashboard)

### Backend

- AWS Lambda (Node 18)
- API Gateway (REST)
- Unified RSS/JSON aggregator
- Health endpoint
- Normalized FEEDS map

## 📡 Backend FEEDS Map (Routing Layer)

The backend uses a strict FEEDS map containing only:

- RSS URLs
- `json:<handler>`
- `fallback:<feedKey>`

This ensures predictable routing and stable health checks.

**Example:**

```js
export const FEEDS = {
  ct: "https://cointelegraph.com/rss",
  decrypt: "https://decrypt.co/feed",
  yahoo_crypto: "json:yahoo_crypto",
  cb: "fallback:cb",
  marketwatch_finance: "https://www.marketwatch.com/rss/topstories",
  baeldung_java: "https://www.baeldung.com/feed",
  espn_sports: "https://www.espn.com/espn/rss/news"
};
```

## ❤️ Health Endpoint

The health endpoint safely checks each feed:

- Validates URLs
- Handles JSON + fallback feeds
- Uses safe fetch with timeout + double try/catch

**Returns:**

```json
{
  "status": "ok",
  "feeds": {
    "ct": "ok",
    "decrypt": "ok",
    "cb": "fallback",
    "marketwatch_finance": "ok"
  }
}
```

## 🔐 Authentication (Test Mode Only)

Login + Register use unencrypted LocalStorage.

**⚠️ Warning displayed in UI:**

- Credentials are **NOT** encrypted
- Do **NOT** use real passwords
- For testing/demo only

Google OAuth login is supported for demo purposes.

## 🎨 UI Layout

### HeaderShell

```
[ Fixed AppBar ]
[ Banner ]
[ Ticker ]
```

### Main Content

Automatically offset using measured header height.

### Reusable Layout Snippets

- 2-column responsive grid
- Icon-left / content-right layout
- Custom banner slot for Login/Register

## 🧩 Development

### Install

```bash
npm install
```

### Run

```bash
npm start
```

### Build

```bash
npm run build
```

## 🧪 Testing the Backend

### Health Check

```
GET /RSSProxyAggregator?mode=health
```

### Feed Fetch

```
GET /RSSProxyAggregator?feed=<key>
```

## 📦 Deployment

### Frontend

- Netlify
- Vercel
- S3 + CloudFront

### Backend

- AWS Lambda
- API Gateway
- CloudWatch logs

## 🏁 Version

**v1.141** — Stable release with:

- Recharts integration
- HeaderShell refactor
- Feed health normalization
- Layout fixes
- Banner support
- Login/Register alignment