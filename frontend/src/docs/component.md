```markdown
# component.md — Kofi Solutions Components (v1.17)

A complete reference for all major frontend components.

## 🧩 Component Overview

The v1.17 frontend is composed of modular, reusable components designed for stability, clarity, and real-time updates.

## 🎨 Components

### 1. HeaderShell.jsx

**Responsibilities**

- Fixed AppBar
- Banner slot
- Live ticker
- Drawer navigation
- Auto-offset main content

**Key Props**

| Prop   | Type       | Description               |
|--------|------------|---------------------------|
| banner | ReactNode  | Optional banner content   |

**Notes**

- Uses `ResizeObserver` to measure header height
- Ticker uses normalized market symbols

### 2. MainBar.jsx

**Responsibilities**

- Secondary navigation bar
- Used on Login/Register pages
- Supports custom banners

### 3. TabsLayout.jsx

**Responsibilities**

- Category tabs (crypto, finance, news…)
- Feed tabs (ct, decrypt, yahoo_crypto…)
- Renders `RSSFeed` + `MarketChart`
- Displays health badges

**Key Props**

| Prop       | Type   | Description                  |
|------------|--------|------------------------------|
| categories | array  | Category definitions         |
| feeds      | object | `FEEDS` map                  |

**Notes**

- Correct `feedId` propagation
- Stable switching across categories

### 4. RSSFeed.jsx

**Responsibilities**

- Fetches feed via `?mode=feed&feed=<id>`
- Displays feed items
- Supports debug mode
- Shows fallback messaging
- Batch loading (“Load more”)

**Key Props**

| Prop   | Type   | Description                  |
|--------|--------|------------------------------|
| feedId | string | Feed key from `FEEDS` map    |

### 5. FeedCard.jsx

**Responsibilities**

- Renders individual feed items
- Displays title, date, source, thumbnail
- Supports per-item refresh

**Key Props**

| Prop     | Type   | Description            |
|----------|--------|------------------------|
| item     | object | Feed item              |
| feedMeta | object | `FEEDS` metadata       |

### 6. MarketChart.jsx

**Responsibilities**

- Renders price + history chart
- Uses Recharts
- Graceful fallback UI

**Key Props**

| Prop   | Type   | Description       |
|--------|--------|-------------------|
| symbol | string | Market symbol     |

### 7. FeedStatusBar.jsx

**Responsibilities**

- Bottom health indicator
- Shows global health status
- Uses `FeedStatusContext`

### 8. FeedHealthDashboard.jsx

**Responsibilities**

- Right-side drawer
- Full feed + market health matrix
- Color-coded statuses

### 9. FeedStatusContext.jsx

**Responsibilities**

- Global health state
- Polls backend every 60s
- Normalizes backend → legacy status
- Provides:
  - `status`
  - `health`
  - `strictMode`
  - `sampleSize`
  - `debugMode`
  - `lastUpdated`

## 🧪 Component Interactions

```
TabsLayout
 ├─ RSSFeed
 ├─ MarketChart
 └─ FeedStatusBar

FeedStatusContext
 ├─ TabsLayout
 ├─ FeedHealthDashboard
 ├─ FeedStatusBar
 └─ HeaderShell (ticker)
```

## 🏁 Component Summary (v1.17)

- Fully normalized props
- Stable feed + category switching
- Health-driven UI
- Responsive, branded layout
- Zero mismatches with backend
```
