
---

# 🧩 Component

```markdown
# Component Overview

The frontend is a modular React SPA built with MUI and Recharts.

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
  - ok → green
  - error → red
  - fallback → yellow
  - json → treated as ok

### MarketChart
- Recharts-powered 1‑day snapshot chart
- Smooth animations
- ResponsiveContainer for scaling

### RSSFeed / FeedCard
- Renders normalized feed items
- Supports fallback images
- Consistent layout across categories

## Layout Utilities

### Two‑Column Layout
- Responsive grid
- Icon-left / content-right pattern

### Banner Slot
- Used on Login/Register pages
- Accepts any image or JSX

## Authentication (Test Mode)
- LocalStorage only
- Not encrypted
- Warning displayed in UI
