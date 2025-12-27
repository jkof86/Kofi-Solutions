# 📜 Changelog

### All notable changes to the **Kofi Solutions Dashboard** will be documented here.


```markdown
# CHANGELOG.md — Kofi Solutions Dashboard

A complete version history covering the evolution from v1.141 → v1.145 → v1.17, including backend rewrites, frontend stabilization, health system upgrades, and full FEEDS normalization.

## 📝 CHANGELOG

### v1.17 — Major Stability Release (Dec 2025)

**Status:** Stable  
**Scope:** Full-system normalization, backend rewrite, frontend rewiring, health overhaul

#### 🔥 Backend

- Rebuilt entire Lambda backend architecture
- Unified routing (`mode=feed`, `mode=market`, `mode=health`)
- Added crash-proof handlers:
  - `handleFeed` (RSS + JSON + HTML fallback)
  - `handleMarket` (crypto + stock + ETF)
  - `handleHealth` (parallel feed + market checks)
- Normalized `FEEDS` map (strict alignment with frontend)
- Restored Axios dependency (critical fix)
- Restored HTML fallback for protected feeds
- Added market history support for charts
- Added safe fetch with timeout + double try/catch
- Clean JSON responses across all endpoints
- Eliminated all “Missing feed parameter” errors

#### 🔥 Frontend

- Rewired `TabsLayout`:
  - Correct `feedId` propagation
  - Stable category + feed switching
  - Correct `MarketChart` symbol mapping
- Rebuilt `RSSFeed`:
  - Correct backend contract (`?mode=feed&feed=...`)
  - Debug mode restored
  - Fallback messaging added
  - Batch loading stabilized
- Rebuilt `MarketChart`:
  - Responsive container
  - Safe rendering
  - Graceful fallback UI
- Upgraded `FeedStatusContext` to v1.180:
  - Automatic health polling
  - Backend → legacy status normalization
  - Global health object
  - Timestamp tracking
- Ticker stabilization:
  - Normalized symbols
  - Health-driven fallback logic

#### 🔥 Health System

- Real-time feed + market health
- Drawer dashboard integration
- Status badges in `TabsLayout`
- Unified health object powering:
  - `FeedStatusBar`
  - `FeedHealthDashboard`
  - `TabsLayout`
  - Ticker fallback logic

#### 🔧 Fixes

- Fixed all undefined feed IDs
- Fixed all undefined symbols
- Fixed chart width/height = -1 errors
- Fixed feed switching race conditions
- Fixed ticker looping
- Fixed fallback feeds misreporting as errors

### v1.145 — Pre-Normalization Patch (Nov 2025)

**Status:** Deprecated  
**Scope:** Partial fixes, early health integration

#### 🔧 Fixes

- Added early health endpoint
- Added initial `FEEDS` normalization
- Fixed ticker alignment
- Fixed `HeaderShell` offset issues
- Added fallback feed category
- Added debug mode for `RSSFeed`
- Added basic `MarketChart` integration

#### ⚠️ Issues (resolved in v1.17)

- Missing Axios dependency (critical)
- Inconsistent `FEEDS` map
- Incorrect `feedId` propagation
- `MarketChart` crashes
- Health dashboard mismatches
- Legacy feed fallback failures

### v1.141 — Stable Release (Oct 2025)

**Status:** Stable (Legacy)  
**Scope:** First fully functional dashboard release

#### ✨ Features

- Recharts integration
- `HeaderShell` refactor
- Feed health normalization
- Layout fixes
- Banner support
- Login/Register alignment
- Basic `RSSFeed` + `FeedCard` system
- Initial ticker implementation

#### ⚠️ Limitations

- No unified backend routing
- No fallback feed support
- No market history
- No health polling
- No `FEEDS` normalization
- No category-driven architecture

## 🏁 Summary

| Version | Status          | Description                                      |
|---------|-----------------|--------------------------------------------------|
| v1.17   | ⭐ Stable        | Full-system rewrite, normalized backend, stable frontend, real-time health |
| v1.145  | ⚠️ Deprecated   | Partial fixes, inconsistent FEEDS, missing dependencies |
| v1.141  | 🟦 Legacy Stable| First complete dashboard release                 |
```

## **v1.141 — Stable Release**
**Date:** 2025‑12‑24

### Added
- Recharts integration for MarketChart (1D snapshot + responsive line chart)
- HeaderShell refactor with ResizeObserver height measurement
- FeedHealthDashboard normalization and improved status mapping
- Custom banner slot for Login/Register pages
- Two‑column responsive layout utilities
- Icon‑left / content‑right layout pattern
- Backend FEEDS normalization (strict RSS / JSON / fallback routing)
- Safe health endpoint with URL validation + double try/catch
- Updated README with architecture overview

### Fixed
- Main content offset issues under fixed HeaderShell
- Feed health mismatches between frontend and backend
- Snapshot chart rendering failures
- Drawer navigation alignment
- Login/Register form overlap with header

### Improved
- UI consistency across pages
- Error handling for backend fetch failures
- Local test‑mode authentication warnings
- Responsive spacing and layout polish

---

## **v1.140 — Pre‑Release**
- Initial integration of feed categories
- Basic RSS aggregation
- Early UI shell and layout scaffolding

---

## **v1.139 and earlier**
- Internal prototypes and experimental builds
