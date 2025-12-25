# 📡 API

The dashboard communicates with a single backend endpoint:

```
/RSSProxyAggregator
```

## Endpoints

### 1. Fetch a Feed

```http
GET /RSSProxyAggregator?feed=<key>
```

Returns a normalized list of feed items.

### 2. Health Check

```http
GET /RSSProxyAggregator?mode=health
```

Returns the status of all feeds in the FEEDS map.

## Response Shapes

### Feed Response

```json
{
  "status": "ok",
  "items": [
    {
      "title": "...",
      "link": "...",
      "published": "...",
      "summary": "...",
      "image": "..."
    }
  ]
}
```

### Health Response

```json
{
  "status": "ok",
  "feeds": {
    "ct": "ok",
    "decrypt": "ok",
    "cb": "fallback"
  }
}
```

## Notes

- All feeds (RSS or JSON) are normalized to the same structure.
- Fallback feeds return `"fallback"` in health mode.
- JSON handlers are invoked via `json:<handler>` in the FEEDS map.

---

# 🧩 Component Overview

The frontend is a modular React Single Page Application (SPA) built with **MUI** and **Recharts**.

## Core Components

### HeaderShell

- Fixed header
- Banner slot
- Live ticker row
- Drawer navigation
- Auto height measurement via ResizeObserver

### MainBar

- Secondary navigation bar
- Used on Login/Register pages
- Supports custom banners

### FeedHealthDashboard

- Displays health of all backend feeds
- Color-coded:
  - `ok` → green
  - `error` → red
  - `fallback` → yellow
  - `json` → treated as `ok`

### MarketChart

- Recharts-powered 1-day snapshot chart
- Smooth animations
- ResponsiveContainer for scaling

### RSSFeed / FeedCard

- Renders normalized feed items
- Supports fallback images
- Consistent layout across categories

## Layout Utilities

### Two-Column Layout

- Responsive grid
- Icon-left / content-right pattern

### Banner Slot

- Used on Login/Register pages
- Accepts any image or JSX

## Authentication (Test Mode)

- LocalStorage only
- Not encrypted
- Warning displayed in UI