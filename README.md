```markdown
# README.frontend.md — Kofi Solutions Frontend (v1.17)

A modular, reactive, real-time dashboard built with React 18 + MUI v5.

## 🏗️ Overview

The v1.17 frontend is a fully normalized, production-ready React application designed to consume the unified backend aggregator.  
This release focuses on:

- Stability
- Correct wiring
- Health-driven UI
- Market chart reliability
- Feed switching + category switching
- Debug visibility

The entire UI is now driven by a consistent global state model, ensuring predictable behavior across all components.

## 🚀 Key Improvements in v1.17

### 🔥 1. TabsLayout Rebuild

The core dashboard layout has been fully rewired:

- Correct `feedId` propagation
- Correct symbol mapping for `MarketChart`
- Category switching resets feed index
- Feed switching stable across all categories
- Health badges mapped from global health object
- Debug logging added for visibility

This eliminates long-standing issues with:

- Undefined feed IDs
- Missing feed parameters
- Incorrect symbol mapping
- Tabs not updating on category change

### 🔥 2. RSSFeed Rebuild

`RSSFeed.jsx` now:

- Uses `feedId` instead of legacy name
- Calls backend using the correct contract: `?mode=feed&feed=<id>`
- Supports debug mode (`&debug=debug_feeds`)
- Displays fallback mode messaging
- Handles empty feeds gracefully
- Supports batch loading (“Load more”)
- Shows per-item refresh

This resolves:

- “Missing feed parameter”
- Silent failures
- Incorrect debug behavior

### 🔥 3. MarketChart Stabilization

`MarketChart.jsx` now:

- Uses a fixed-height responsive container
- Handles missing history arrays
- Prevents width/height = -1 errors
- Displays graceful fallback UI
- Correctly maps symbols from `FEEDS`

This resolves:

- Recharts crashes
- “No chart data” loops
- Rendering behind fixed header

### 🔥 4. FeedStatusContext v1.180

The global health system now includes:

- Automatic polling (`?mode=health`)
- Backend → legacy status normalization
- Global health object
- `strictMode` + `sampleSize` preserved
- `lastUpdated` timestamp
- Debug mode

This powers:

- `FeedStatusBar`
- `FeedHealthDashboard`
- `TabsLayout` badges
- Ticker fallback logic

### 🔥 5. Ticker + HeaderShell Stability

- Ticker now uses normalized market symbols
- Fallback logic tied to health object
- `HeaderShell` auto-offset via `ResizeObserver`
- Fully responsive across breakpoints

## 🧩 Frontend File Structure

```
/src
  /components
    HeaderShell.jsx
    MainBar.jsx
    TabsLayout.jsx
    RSSFeed.jsx
    FeedCard.jsx
    MarketChart.jsx
    FeedStatusBar.jsx
    FeedHealthDashboard.jsx
  /context
    FeedStatusContext.jsx
  /data
    feedCategories.js
    feedsMap.js
  /auth
    Login.jsx
    Register.jsx
  /debug
    DebugPanel.jsx
  /docs
    README.md
    backend.md
    frontend.md
    architecture.md
    CHANGELOG.md
```

## 🎨 UI Architecture

### HeaderShell

- Fixed AppBar
- Banner slot
- Live ticker
- Drawer navigation

### TabsLayout

- Category tabs (crypto, finance, news…)
- Feed tabs (ct, decrypt, yahoo_crypto…)
- Feed content + MarketChart side-by-side

### RSSFeed

- Batch loading
- Debug mode
- Fallback messaging
- Per-item refresh

### MarketChart

- Recharts line chart
- Responsive container
- Auto-height
- Graceful fallback

### FeedStatusBar

- Bottom health indicator
- Uses global health object

### FeedHealthDashboard

- Right-side drawer
- Full feed + market health matrix

## 🔐 Authentication

- LocalStorage-based test mode
- Google OAuth supported for demo
- Warning displayed for non-encrypted credentials

## 🧪 Running Locally

**Install**

```bash
npm install
```

**Run**

```bash
npm start
```

**Build**

```bash
npm run build
```

## 🏁 Frontend Summary (v1.17)

- `TabsLayout` fully rewired
- `RSSFeed` contract fixed
- `MarketChart` stabilized
- Health system integrated
- Ticker normalized
- `FEEDS` + categories aligned
- Debug visibility improved
- Zero mismatches with backend
```
