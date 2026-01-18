This README is designed for:

- New engineers onboarding  
- Future you (when you forget why something works the way it does)  
- Backend + frontend clarity  
- Deployment sanity  
- Validator + handler authors  
- Anyone touching FEEDS, FEED_CATEGORIES, or the enrichment pipeline  

It reflects the architecture, naming conventions, JSON/RSS split, handler logic, and the corrected numeric‑safe keys.

---

# 📚 **Kofi Solutions Feed System — README (v1.197)**

## Overview
The Kofi Solutions Feed System powers all dynamic content in the dashboard, including:

- Crypto news + JSON market feeds  
- Finance market news  
- US + World news  
- Technology, Business, Fitness  
- Sports, Gaming, Entertainment  
- Food / Cooking  

The system is built around **two core registries**:

1. **FEEDS** — a master map of every feed (RSS or JSON)  
2. **FEED_CATEGORIES** — UI‑friendly groupings for sub‑category navigation  

Both frontend and backend consume the same feed definitions, ensuring consistent behavior across the entire platform.

---

# 1. 📦 FEEDS Registry

## Location
- **Frontend:** `src/data/feedsMap.js`  
- **Backend:** `src/data/feedsMap.js`

## Format
### Frontend
```js
export const FEEDS = { ... }
```

### Backend
```js
const FEEDS = { ... }
module.exports = FEEDS;
```

## Feed Object Structure
Every feed is a **rich object** with the following fields:

```js
{
  id: "unique_key",
  name: "Human Readable Name",
  url: "https://feed-url.com/rss-or-json",
  type: "rss" | "json",
  category: "news" | "world" | "finance" | "crypto" | "technology" | "business" | "fitness" | "sports" | "gaming" | "entertainment" | "food",
  
  // JSON feeds only:
  handler: "handler_name",

  // Finance + Crypto only:
  symbol: "BTC-USD" | "SPY"
}
```

### Rules
- **RSS feeds** → no handler  
- **JSON feeds** → must include a handler  
- **Only crypto + finance** feeds include `symbol`  
- **Category** is always a **top‑level lowercase string**  
- **Keys must not start with numbers**  
  - Example:  
    - `100_days_clean` → ❌  
    - `days_clean` → ✅  
    - `101_cookbooks` → ❌  
    - `cookbooks_101` → ✅  

---

# 2. 🧩 FEED_CATEGORIES Registry

## Location
`src/data/feedCategories.js`

## Purpose
This file defines **UI‑friendly groupings** for sub‑categories inside each top‑level category.

Examples:

- `technology_general`
- `business_markets`
- `sports_leagues`
- `gaming_platforms`
- `food_baking`

Each key maps to an array of **feed IDs** from the FEEDS registry.

## Format
```js
export const FEED_CATEGORIES = {
  subcategory_name: [
    "feed_id_1",
    "feed_id_2",
    ...
  ],
};
```

### Rules
- FEED_CATEGORIES **never** contains URLs or metadata  
- FEED_CATEGORIES **must** reference valid FEEDS keys  
- FEED_CATEGORIES is **frontend‑only**  
- FEED_CATEGORIES drives:
  - Sidebar grouping  
  - Sub‑tabs  
  - Feed selection UI  

---

# 3. ⚙️ JSON Feed Handlers

JSON feeds require a handler defined in:

`backend/src/handlers/`

Each handler:

- Accepts raw JSON  
- Normalizes it into the **universal feed item format**  
- Extracts:
  - title  
  - link  
  - description  
  - published date  
  - image (if available)  

### Example Handler Contract
```js
module.exports = function handle(json) {
  return json.items.map(item => ({
    title: item.title,
    link: item.url,
    description: item.summary,
    published: item.published_at,
    image: item.image_url || null,
  }));
};
```

---

# 4. 🧠 Universal Enrichment Pipeline

All feeds (RSS + JSON) pass through the enrichment pipeline:

1. **Fetch**  
2. **Parse** (RSS → XML → JSON)  
3. **Normalize** (via handler or RSS parser)  
4. **Enrich**  
   - OG tags  
   - JSON‑LD  
   - `<figure>` / `<picture>`  
   - Lazy‑loaded images  
   - Hero image detection  
   - Body‑content fallback  
5. **Return standardized feed items**

This ensures consistent UI rendering regardless of source.

---

# 5. 🧪 Validator

A validator script ensures:

- All FEEDS keys are unique  
- All FEED_CATEGORIES references exist  
- All JSON feeds have handlers  
- No numeric‑starting keys  
- All categories are valid top‑level strings  
- All URLs are reachable (optional health check)  

---

# 6. 🚀 Deployment Workflow

### Frontend
1. Update `feedsMap.js`  
2. Update `feedCategories.js`  
3. Build → Deploy to S3  
4. CloudFront invalidation (if needed)

### Backend
1. Update `feedsMap.js`  
2. Add/update JSON handlers  
3. Deploy Lambda  
4. Validate logs for:
   - Fetch errors  
   - Handler errors  
   - Enrichment failures  

---

# 7. 🧭 Naming Conventions

### FEEDS keys
- Lowercase  
- Underscore‑separated  
- No numbers at the start  
- No spaces  
- No hyphens  

### FEEDS names
- Clean publication names  
- No descriptive suffixes  

### Categories
- Lowercase  
- Top‑level only  
- No sub‑categories in FEEDS  

### FEED_CATEGORIES keys
- `{category}_{subcategory}`  
- Lowercase  
- Underscore‑separated  

---

# 8. 🗂 File Structure

```
frontend/
  src/
    data/
      feedsMap.js
      feedCategories.js

backend/
  src/
    data/
      feedsMap.js
    handlers/
      yahoo_crypto.js
      cryptopanic_crypto.js
      coingecko_crypto.js
    utils/
      enrich.js
      parseRss.js
```

---

# 9. 🧵 Versioning

This README corresponds to:

**v1.197 — Full Feed System Expansion**

Includes:

- 160+ feeds  
- 11 top‑level categories  
- Full JSON handler support  
- Numeric‑safe key corrections  
- Updated FEED_CATEGORIES taxonomy  

---

# 10. 🏁 Summary

The feed system is now:

- Fully normalized  
- Fully enriched  
- Fully categorized  
- Frontend + backend aligned  
- Scalable for future categories  
- Safe for deployment  
- Easy for new engineers to understand  

**production‑grade, future‑proof feed architecture**.
