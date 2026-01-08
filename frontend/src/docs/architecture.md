```markdown
# architecture.md — Kofi Solutions Dashboard (v1.17)

A fully normalized, end-to-end architecture for real-time feeds, markets, and system health.

## 🏗️ System Overview

Kofi Solutions Dashboard v1.17 is a two-tier architecture:

- **Frontend**: React 18 + MUI v5
- **Backend**: AWS Lambda (Node 18) + API Gateway

The system delivers real-time RSS/JSON aggregation, market snapshots, and health monitoring through a unified, normalized data model.

## 🧩 High-Level Architecture Diagram

```
┌──────────────────────────────┐
│          Frontend            │
│      React + MUI v5          │
│                              │
│  ┌────────────────────────┐  │
│  │   FeedStatusContext    │  │
│  │  (global health state) │  │
│  └────────────────────────┘  │
│           ▲        ▲         │
│           │        │         │
│  ┌────────┘        └────────┐│
│  │                           ││
│  │   TabsLayout / RSSFeed    ││
│  │   MarketChart / Ticker    ││
│  │   FeedHealthDashboard     ││
│  │                           ││
└──┴───────────────┬──────────┴┘
                    │
                    ▼
        ┌────────────────────────────┐
        │        API Gateway         │
        │  /RSSProxyAggregator       │
        └───────────────┬───────────┘
                        │
                        ▼
        ┌────────────────────────────┐
        │        AWS Lambda          │
        │        backend.js          │
        │                            │
        │  mode=feed   → handleFeed  │
        │  mode=market → handleMarket│
        │  mode=health → handleHealth│
        └───────────────┬───────────┘
                        │
                        ▼
        ┌────────────────────────────┐
        │ External Data Providers    │
        │                            │
        │ RSS Feeds (CT, Decrypt…)   │
        │ JSON APIs (Yahoo Crypto)   │
        │ HTML Fallback Sources      │
        │ Market APIs (Yahoo, CG)    │
        └────────────────────────────┘
```

## 🧱 Backend Architecture

The backend is a single Lambda function with a unified router.

### Routing Layer (`backend.js`)

```
?mode=feed&feed=<id>
?mode=market&symbol=<symbol>
?mode=health
```

### Handlers

- `handleFeed.js`
  - JSON handler → RSS parser → HTML fallback
  - Crash-proof, normalized output
- `handleMarket.js`
  - Crypto → Stock → ETF resolution
  - Returns price + history
- `handleHealth.js`
  - Parallel checks
  - Normalized health object

### Data Maps

- `feedsMap.js`
- `cryptoMap.js`
- `stocksMap.js`
- `etfMap.js`

### Utilities

- `rssParser.js`
- `htmlFallback.js`
- `jsonResponse.js`
- `fetchCryptoPrice.js`
- `fetchYahooPrice.js`

### Backend Guarantees

- No crashes
- No undefined fields
- Fallback-safe
- Fully aligned with frontend

## 🎨 Frontend Architecture

The frontend is a React SPA with a global health context.

### Global State: `FeedStatusContext`

Tracks:

- `status` (legacy per-feed status)
- `health` (full backend health object)
- `strictMode`
- `sampleSize`
- `debugMode`
- `lastUpdated`

Automatically polls `?mode=health` every 60 seconds.

### Core Components

**HeaderShell**

- Fixed AppBar
- Banner slot
- Live ticker
- Drawer navigation

**TabsLayout**

- Category tabs
- Feed tabs
- Health badges
- MarketChart integration

**RSSFeed**

- Fetches feed via `?mode=feed&feed=<id>`
- Debug mode
- Fallback messaging
- Batch loading

**MarketChart**

- Recharts line chart
- Responsive container
- History-based rendering

**FeedHealthDashboard**

- Right-side drawer
- Full feed + market matrix

**FeedStatusBar**

- Bottom health indicator
- Uses global health object

## 🔄 Data Flow

### Feed Fetch Flow

```
RSSFeed → API Gateway → Lambda (handleFeed)
        → RSS/JSON/Fallback → normalized items → UI
```

### Market Flow

```
MarketChart → API Gateway → Lambda (handleMarket)
            → price + history → Recharts → UI
```

### Health Flow

```
FeedStatusContext → API Gateway → Lambda (handleHealth)
                  → global health object → badges + dashboards + ticker
```

## 🧪 Error Handling Architecture

### Backend

- Double try/catch
- Timeout-safe fetch
- Normalized error responses
- No Lambda crashes

### Frontend

- Graceful fallback UI
- Debug panels
- Health-driven rendering
- No undefined feed IDs or symbols

## 📦 Deployment Architecture

### Frontend

- Netlify / Vercel / S3 + CloudFront
- SPA routing
- Build artifacts in `/build`

### Backend

- AWS Lambda (Node 18)
- API Gateway REST
- CloudWatch logs
- No VPC required

## 🏁 Architecture Summary (v1.17)

- Fully normalized `FEEDS` + symbol maps
- Unified backend routing
- Crash-proof handlers
- Real-time health system
- Stable category + feed switching
- Responsive, branded UI
- Zero mismatches between frontend and backend
```
