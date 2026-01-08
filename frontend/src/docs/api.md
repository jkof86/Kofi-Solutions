```markdown
# api.md — Kofi Solutions API (v1.17)

A unified, normalized API powering feeds, markets, and system health.

## 🏗️ Overview

All backend functionality is exposed through a single AWS Lambda behind API Gateway, using a unified routing model:

```
/RSSProxyAggregator?mode=<mode>&<params>
```

**Supported modes:**

- `mode=feed`
- `mode=market`
- `mode=health`

All responses are normalized JSON objects designed for predictable frontend consumption.

## 📡 Endpoints

### 1. Feed Endpoint

**GET** `/RSSProxyAggregator?mode=feed&feed=<id>`

#### Parameters

| Name   | Type   | Required | Description                                      |
|--------|--------|----------|--------------------------------------------------|
| feed   | string | yes      | Feed ID from `FEEDS` map                         |
| debug  | string | no       | `debug=debug_feeds` enables verbose backend logging |

#### Response

```json
{
  "status": "ok" | "fallback" | "error",
  "feed": "ct",
  "items": [
    {
      "title": "...",
      "url": "...",
      "date": "...",
      "source": "CoinTelegraph"
    }
  ],
  "debug": { ... }
}
```

**Status meanings**

- `ok` → RSS or JSON handler succeeded
- `fallback` → HTML fallback parser succeeded
- `error` → All handlers failed

### 2. Market Endpoint

**GET** `/RSSProxyAggregator?mode=market&symbol=<symbol>`

#### Parameters

| Name   | Type   | Required | Description                            |
|--------|--------|----------|----------------------------------------|
| symbol | string | yes      | Crypto, stock, or ETF symbol           |

#### Response

```json
{
  "status": "ok",
  "type": "crypto" | "stock" | "etf",
  "symbol": "btc",
  "price": 123.45,
  "history": [
    { "t": 1700000000, "p": 123.45 },
    ...
  ]
}
```

**Symbol resolution**

- Crypto → `CRYPTO_MAP`
- Stocks → `STOCK_MAP`
- ETFs → `ETF_MAP`

### 3. Health Endpoint

**GET** `/RSSProxyAggregator?mode=health`

#### Response

```json
{
  "status": "ok",
  "feeds": {
    "ct": { "ok": true, "status": "ok", "count": 25 },
    "decrypt": { "ok": false, "status": "error", "count": 0 }
  },
  "markets": [
    { "symbol": "btc", "ok": true, "type": "crypto" },
    { "symbol": "aapl", "ok": false, "type": "stock" }
  ]
}
```

**Used by**

- `FeedStatusContext`
- `FeedStatusBar`
- `FeedHealthDashboard`
- `TabsLayout` badges
- Ticker fallback logic

## 🔧 Error Handling

All endpoints return:

```json
{
  "status": "error",
  "error": "Message",
  "detail": "Optional stack trace"
}
```

Errors never crash Lambda — all handlers are wrapped in double try/catch.

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

## 🏁 API Summary (v1.17)

- Unified routing
- Normalized responses
- Crash-proof handlers
- Fallback-aware feed system
- Market history support
- Real-time health monitoring
```
