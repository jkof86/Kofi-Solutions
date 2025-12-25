// ------------------------------------------------------------
// backend.js — v1.143 (Kofi Solutions)
// ------------------------------------------------------------
//
// - FEEDS-based routing for RSS/JSON/fallback feeds
// - CoinCap (crypto) + Yahoo Finance (stocks) for market snapshots
// - Universal health handler (never throws, always returns JSON)
// - Market failure tracking for health dashboard
// - DNS-safe, timeout-safe, HTML-safe
// ------------------------------------------------------------

import { FEEDS } from "./feedsMap.js";

// ------------------------------------------------------------
// JSON Response Helper
// ------------------------------------------------------------
function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS"
    },
    body: JSON.stringify(payload)
  };
}

// ------------------------------------------------------------
// CDATA + Image Extraction Helpers
// ------------------------------------------------------------
function stripCdata(str = "") {
  return str.replace("<![CDATA[", "").replace("]]>", "").trim();
}

function extractImage(html = "") {
  if (!html) return null;

  const media = html.match(/<media:content[^>]*url="([^"]+)"/i);
  if (media) return media[1];

  const enclosure = html.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (enclosure) return enclosure[1];

  const img = html.match(/<img[^>]*src="([^"]+)"/i);
  if (img) return img[1];

  return null;
}

function stripImgTags(html = "") {
  return html.replace(/<img[^>]*>/gi, "").trim();
}

// ------------------------------------------------------------
// RSS Parser
// ------------------------------------------------------------
function extractImageFromBlock(block) {
  let m = block.match(/<media:content[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  m = block.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  m = block.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  m = block.match(/<img[^>]*src="([^"]+)"/i);
  if (m) return m[1];

  return null;
}

async function parseFeed(text, feedKey) {
  const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => {
    const block = match[1];

    const get = tag => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return stripCdata(m ? m[1] : "");
    };

    let description = get("description");

    let image;
    if (feedKey === "ct") {
      description = stripImgTags(description);
      image = extractImageFromBlock(block);
    } else {
      image = extractImage(description) || extractImageFromBlock(block);
    }

    return {
      title: get("title"),
      url: get("link"),
      summary: description,
      content_html: description,
      date_published: get("pubDate"),
      image
    };
  });

  return items;
}

// ------------------------------------------------------------
// RSS Handler
// ------------------------------------------------------------
async function handleRss(url, feedKey) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8"
      }
    });

    const text = await res.text();
    const items = await parseFeed(text, feedKey);

    return jsonResponse(200, { status: "ok", items });
  } catch (err) {
    console.error("RSS error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "RSS exception: " + err.message,
      items: []
    });
  }
}

// ------------------------------------------------------------
// Fallback URLs & IMGs
// ------------------------------------------------------------
const FALLBACK_URLS = {
  cb: "https://blog.coinbase.com/",
  binance_blog: "https://www.binance.com/en/blog",
  kraken_blog: "https://blog.kraken.com/",
  rh_crypto: "https://robinhood.com/crypto",
  ft_finance: "https://www.ft.com/",
  reuters_world: "https://www.reuters.com/world/",
  marketwatch_finance: "https://www.marketwatch.com/",
  yahoo_finance: "https://finance.yahoo.com/",
  ap_world: "https://apnews.com/",
  sky_sports: "https://www.skysports.com/",
  darkreading_security: "https://www.darkreading.com/",
  logrocket_react: "https://blog.logrocket.com/",
  infoq_java: "https://www.infoq.com/java/",
  iot_agenda: "https://www.techtarget.com/iotagenda/",
  espn_sports: "https://www.espn.com/"
};

const FALLBACK_IMAGES = {
  cb: "https://www.coinbase.com/favicon.ico",
  binance_blog: "https://www.binance.com/favicon.ico",
  kraken_blog: "https://www.kraken.com/favicon.ico",
  rh_crypto: "https://robinhood.com/favicon.ico",
  cryptopanic_crypto: "https://cryptopanic.com/favicon.ico"
};

// ------------------------------------------------------------
// Fallback Card
// ------------------------------------------------------------
function buildFallbackCard(feedKey) {
  return {
    title: `Feed Unavailable — ${feedKey}`,
    url: FALLBACK_URLS[feedKey] || "",
    summary: `The feed "${feedKey}" is currently unavailable.`,
    content_html: `<p>The feed "${feedKey}" is currently unavailable.</p>`,
    date_published: new Date().toISOString(),
    image: null
  };
}

async function handleFallback(feedKey) {
  return jsonResponse(200, {
    status: "error",
    error: `Feed "${feedKey}" is currently unavailable (fallback mode).`,
    items: [buildFallbackCard(feedKey)]
  });
}

// ------------------------------------------------------------
// JSON Handlers (News)
// ------------------------------------------------------------

// CryptoPanic
const CRYPTOPANIC_TOKEN = "YOUR_CRYPTOPANIC_TOKEN";

async function handleCryptoPanic() {
  try {
    const url =
      `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_TOKEN}&public=true`;

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const json = await res.json();
    const results = json.results || [];

    const items = results.map(post => ({
      title: post.title,
      url: post.url,
      summary: post.domain || "",
      content_html: post.title,
      date_published: post.published_at,
      image: null
    }));

    return jsonResponse(200, { status: "ok", items });
  } catch (err) {
    console.error("CryptoPanic error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "CryptoPanic exception: " + err.message,
      items: []
    });
  }
}

// Yahoo Crypto News
async function handleYahooCrypto() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v7/finance/news?category=cryptocurrency",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await res.text();
    if (text.trim().startsWith("<")) {
      throw new Error("Yahoo returned HTML instead of JSON");
    }

    const json = JSON.parse(text);
    const results = json?.data || [];

    const items = results.map(item => ({
      title: item.title,
      url: item.link || item.url,
      summary: item.summary || "",
      content_html: item.summary || "",
      date_published: item.pubDate || null,
      image:
        item.thumbnail?.resolutions?.[0]?.url ||
        item.main_image_url ||
        null
    }));

    return jsonResponse(200, { status: "ok", items });
  } catch (err) {
    console.error("Yahoo Crypto error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "Yahoo Crypto exception: " + err.message,
      items: []
    });
  }
}

// CoinGecko Status Updates (optional JSON feed)
async function handleCoinGeckoCrypto() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/status_updates",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const json = await res.json();
    const updates = json.status_updates || [];

    const items = updates.map(post => ({
      title: `${post.project?.name || "CoinGecko"} — ${post.category}`,
      url: post.project?.homepage || "https://coingecko.com",
      summary: post.description || "",
      content_html: post.description || "",
      date_published: post.created_at,
      image: post.project?.image?.large || null
    }));

    return jsonResponse(200, { status: "ok", items });
  } catch (err) {
    console.error("CoinGecko Crypto error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "CoinGecko Crypto exception: " + err.message,
      items: []
    });
  }
}

// ------------------------------------------------------------
// Market Snapshot Handler (CoinCap for Crypto + Yahoo Finance for Stocks)
// ------------------------------------------------------------

// Crypto → CoinCap IDs
const CRYPTO_MAP = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  xrp: "xrp",
  ada: "cardano",
  avax: "avalanche"
};

// Stocks → Yahoo Finance symbols
const STOCK_MAP = {
  aapl: "AAPL",
  msft: "MSFT",
  amzn: "AMZN",
  nvda: "NVDA",
  meta: "META",
  goog: "GOOG",
  jpm: "JPM",
  gs: "GS",
  bac: "BAC",
  v: "V",
  ma: "MA",
  "brk.b": "BRK-B",
  orcl: "ORCL",
  ibm: "IBM",
  sap: "SAP",
  dis: "DIS",
  wbd: "WBD",
  manu: "MANU"
};

// Cache + TTL
const MARKET_CACHE = {};
const MARKET_CACHE_TTL_MS = 60 * 1000;

// Track failures for Health Dashboard
const MARKET_FAILURES = new Set();

async function handleMarket(symbol) {
  const key = symbol.toLowerCase();
  const now = Date.now();

  const cached = MARKET_CACHE[key];
  if (cached && now - cached.timestamp < MARKET_CACHE_TTL_MS) {
    return jsonResponse(200, { status: "ok", data: cached.data });
  }

  // CRYPTO (CoinCap)
  if (CRYPTO_MAP[key]) {
    const id = CRYPTO_MAP[key];

    try {
      const chartUrl = `https://api.coincap.io/v2/assets/${id}/history?interval=h1`;
      const chartRes = await fetch(chartUrl, {
        headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
      });

      const chartJson = await chartRes.json();
      if (!chartJson?.data?.length) throw new Error("No chart data");

      const prices = chartJson.data.map(p => [p.time, parseFloat(p.priceUsd)]);
      const data = { prices };

      MARKET_CACHE[key] = { timestamp: now, data };
      MARKET_FAILURES.delete(key);

      return jsonResponse(200, { status: "ok", data });
    } catch (err) {
      console.error(`CoinCap error for ${symbol}:`, err);
      MARKET_FAILURES.add(key);
      return jsonResponse(502, {
        status: "error",
        error: `CoinCap failed for ${symbol}: ${err.message}`
      });
    }
  }

  // STOCKS (Yahoo Finance)
  if (STOCK_MAP[key]) {
    const yfSymbol = STOCK_MAP[key];

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yfSymbol}?interval=1h&range=1d`;

      const res = await fetch(url, {
        headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" }
      });

      const json = await res.json();
      const result = json?.chart?.result?.[0];

      if (!result?.timestamp || !result?.indicators?.quote?.[0]?.close) {
        throw new Error("Invalid Yahoo Finance data");
      }

      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;

      const prices = timestamps.map((t, i) => [
        t * 1000,
        closes[i]
      ]);

      const data = { prices };

      MARKET_CACHE[key] = { timestamp: now, data };
      MARKET_FAILURES.delete(key);

      return jsonResponse(200, { status: "ok", data });
    } catch (err) {
      console.error(`Yahoo Finance error for ${symbol}:`, err);
      MARKET_FAILURES.add(key);
      return jsonResponse(502, {
        status: "error",
        error: `Yahoo Finance failed for ${symbol}: ${err.message}`
      });
    }
  }

  MARKET_FAILURES.add(key);
  return jsonResponse(400, {
    status: "error",
    error: `Unknown symbol: ${symbol}`
  });
}

// ------------------------------------------------------------
// Unified Feed Router
// ------------------------------------------------------------
async function handleFeedRequest(feedKey) {
  const target = FEEDS[feedKey];

  if (!target) {
    return jsonResponse(404, {
      status: "error",
      error: `Unknown feed key: ${feedKey}`,
      items: []
    });
  }

  if (target.startsWith("json:")) {
    const key = target.slice(5);

    if (key === "cryptopanic_crypto") return await handleCryptoPanic();
    if (key === "yahoo_crypto") return await handleYahooCrypto();
    if (key === "coingecko_crypto") return await handleCoinGeckoCrypto();

    return jsonResponse(200, {
      status: "error",
      error: `No JSON handler implemented for ${key}`,
      items: []
    });
  }

  if (target.startsWith("fallback:")) {
    const fbKey = target.slice(9);
    return await handleFallback(fbKey);
  }

  if (/^https?:\/\//.test(target)) {
    return await handleRss(target, feedKey);
  }

  return jsonResponse(200, {
    status: "error",
    error: `Unrecognized FEEDS mapping for ${feedKey}`,
    items: []
  });
}

// ------------------------------------------------------------
// UNIVERSAL HEALTH HANDLER
// ------------------------------------------------------------
async function handleHealth() {
  const safeCheck = async (key, val) => {
    try {
      if (!val || typeof val !== "string") return [key, "error"];
      if (val.startsWith("fallback:")) return [key, "fallback"];
      if (val.startsWith("json:")) return [key, "json"];

      try {
        new URL(val);
      } catch {
        return [key, "error"];
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(val, {
          method: "GET",
          signal: controller.signal
        });

        clearTimeout(timeout);
        return [key, res.ok ? "ok" : "error"];
      } catch (err) {
        console.error(`Health fetch failed for ${key}:`, err.message);
        return [key, "error"];
      }
    } catch (err) {
      console.error(`Health check crashed for ${key}:`, err.message);
      return [key, "error"];
    }
  };

  const feedEntries = await Promise.all(
    Object.entries(FEEDS).map(([key, val]) => safeCheck(key, val))
  );

  const feeds = {};
  for (const [k, v] of feedEntries) feeds[k] = v;

  const markets = Array.from(MARKET_FAILURES || []);

  return jsonResponse(200, {
    status: "ok",
    feeds,
    markets
  });
}

// ------------------------------------------------------------
// Lambda Entry — routing priority: mode → feed
// ------------------------------------------------------------
export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(200, { status: "ok" });
    }

    const qs = event.queryStringParameters || {};
    const mode = qs.mode || "rss";

    if (mode === "health") {
      return await handleHealth();
    }

    if (mode === "market") {
      const symbol = qs.symbol;
      if (!symbol) {
        return jsonResponse(400, {
          status: "error",
          error: "Missing 'symbol' parameter"
        });
      }
      return await handleMarket(symbol);
    }

    const feedKey =
      qs.feed ||
      qs.source ||
      event?.pathParameters?.feed ||
      null;

    if (!feedKey) {
      return jsonResponse(400, {
        status: "error",
        error: "Missing 'feed' or 'source' parameter",
        items: []
      });
    }

    return await handleFeedRequest(feedKey);
  } catch (err) {
    console.error("Lambda exception:", err);
    return jsonResponse(500, {
      status: "error",
      error: err.message
    });
  }
}
