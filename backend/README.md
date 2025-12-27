```markdown
# README.backend.md — Kofi Solutions Backend (v1.17)

A unified, normalized, fault-tolerant AWS Lambda backend powering real-time feeds, markets, and system health.

## 🏗️ Overview

The backend for Kofi Solutions Dashboard v1.17 is a fully modular AWS Lambda function that aggregates:

- RSS feeds
- JSON feeds
- HTML fallback feeds
- Crypto, stock, and ETF market data
- System-wide health status

It exposes a single API Gateway endpoint with three modes:

```
?mode=feed&feed=<id>
?mode=market&symbol=<symbol>
?mode=health
```

This architecture ensures predictable routing, clean error handling, and consistent data structures across the entire frontend.

## 🚀 Key Improvements in v1.17

### 🔥 1. Unified Routing Layer

All backend requests flow through a single entry point: `backend.js`

Routing is determined by mode:

- `mode=feed` → `handleFeed`
- `mode=market` → `handleMarket`
- `mode=health` → `handleHealth`

This eliminates legacy ambiguity and ensures consistent behavior.

### 🔥 2. Fully Normalized FEEDS Map

The `FEEDS` map is now a structured object:

```js
{
  ct: { url, handler, fallback, category },
  decrypt: { ... },
  yahoo_crypto: { handler: "yahooCrypto" },
  cb: { fallback: "cb" },
  ...
}
```

**Benefits:**

- No mismatched IDs
- No undefined categories
- No broken feed tabs
- Perfect alignment with frontend `feedsMap.js`

### 🔥 3. Crash-Proof Feed Handler (`handleFeed`)

`handleFeed` now supports three layers:

1. JSON handler (if defined)
2. RSS parser (default)
3. HTML fallback (for protected feeds)

Each layer is wrapped in safe try/catch with logging.

**Returns:**

```json
{
  "status": "ok" | "fallback" | "error",
  "feed": "ct",
  "items": [...]
}
```

### 🔥 4. Market Handler (`handleMarket`)

Supports:

- Crypto (CoinPaprika / CoinGecko)
- Stocks (Yahoo Finance)
- ETFs (Yahoo Finance)

Symbol resolution:

```js
CRYPTO_MAP[symbol]
STOCK_MAP[symbol]
ETF_MAP[symbol]
```

**Returns:**

```json
{
  "status": "ok",
  "type": "crypto" | "stock" | "etf",
  "symbol": "btc",
  "price": 123.45,
  "history": [...]
}
```

### 🔥 5. Health Handler (`handleHealth`)

Runs parallel checks across:

- All `FEEDS` entries
- All market symbols

Each feed returns:

```json
{ "ok": true/false, "status": "ok|fallback|error", "count": <items> }
```

Each market returns:

```json
{ "symbol": "btc", "ok": true/false, "type": "crypto" }
```

The frontend uses this to power:

- FeedStatusBar
- FeedHealthDashboard
- TabsLayout badges
- Ticker fallback logic

## 📡 Endpoints

| Method | Path                                                      | Description                       |
|--------|-----------------------------------------------------------|-----------------------------------|
| GET    | `/RSSProxyAggregator?mode=feed&feed=<id>`                 | Fetch specific feed content       |
| GET    | `/RSSProxyAggregator?mode=market&symbol=<symbol>`         | Fetch market data for a symbol    |
| GET    | `/RSSProxyAggregator?mode=health`                         | System-wide health check          |

## 🧩 Backend File Structure

```
/backend
  backend.js
  /handlers
    handleFeed.js
    handleMarket.js
    handleHealth.js
  /feeds
    feedsMap.js
  /market
    cryptoMap.js
    stocksMap.js
    etfMap.js
    fetchCryptoPrice.js
    fetchYahooPrice.js
  /utils
    rssParser.js
    htmlFallback.js
    jsonResponse.js
```

## 🛡️ Error Handling

All handlers use:

- Double try/catch
- Timeout-safe fetch
- Clean JSON responses
- No Lambda crashes
- No undefined fields

## 🧪 Testing

**Feed**

```bash
curl "<api>?mode=feed&feed=ct"
```

**Market**

```bash
curl "<api>?mode=market&symbol=btc"
```

**Health**

```bash
curl "<api>?mode=health"
```

## 📦 Deployment Notes

- Node 18 runtime
- Axios must be included in ZIP
- `rss-parser` + `cheerio` required
- No VPC required
- Timeout recommended: 10–15 seconds
- Deploy via AWS Toolkit or CLI

## 🏁 Backend Summary (v1.17)

- Fully normalized `FEEDS` map
- Crash-proof handlers
- Unified routing
- Market history support
- HTML fallback restored
- Health system overhauled
- Zero mismatches with frontend
```