# Kofi Solutions Backend — v1.146

This backend powers the Kofi Solutions dashboard (v1.145+), providing:

- Feed content (`?feed=...`)
- System health (`?mode=health`)
- Market snapshots (`?mode=market&symbol=...`)

It is implemented as a single AWS Lambda behind API Gateway.

---

## Architecture

```text
backend/
  backend.js          # Main Lambda router (handler)

  /handlers
    handleHealth.js   # Health endpoint (feeds + markets)
    handleFeed.js     # Feed content (RSS/JSON/HTML)
    handleMarket.js   # Market snapshot (ticker, etc.)

  /config
    feedsMap.js       # FEEDS metadata (must mirror frontend)
    cryptoMap.js
    stockMap.js
    etfMap.js

  /market
    cryptoPaprika.js
    stockYahoo.js
    etfYahoo.js

  /utils
    rssParser.js
    htmlFallback.js
    safeFetch.js (optional)

  /tests
    health.test.js
    feed.test.js
    market.test.js
    helpers.js
