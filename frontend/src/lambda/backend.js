// ------------------------------------------------------------
// backend.js — v2.0 (Final Production Build)
// ------------------------------------------------------------
//
// - Uses backend FEEDS map (routing only)
// - RSS + JSON + fallback feeds
// - CoinTelegraph special handling
// - Market snapshots (CoinGecko)
// - Health checks
// - Normalized output for UI
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
  // <media:content url="...">
  let m = block.match(/<media:content[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  // <media:thumbnail url="...">
  m = block.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  if (m) return m[1];

  // <enclosure url="...">
  m = block.match(/<enclosure[^>]*url="([^"]+)"/i);
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
    let image = null;

    // CoinTelegraph special handling
    if (feedKey === "ct") {
      description = stripImgTags(description);
      let image = extractImage(description) || extractImageFromBlock(block);
    } else {
      image = extractImage(description);
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
// Fallback URLs
// ------------------------------------------------------------
const FALLBACK_URLS = {
  cb: "https://blog.coinbase.com/",
  binance_blog: "https://www.binance.com/en/blog",
  kraken_blog: "https://blog.kraken.com/",
  rh_crypto: "https://robinhood.com/crypto",
  ft_finance: "https://www.ft.com/"
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
// JSON Handlers
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

// Yahoo Crypto
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

    const json = await res.json();
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

// CoinGecko Status Updates
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
// Market Snapshot Handler
// ------------------------------------------------------------
const SYMBOL_TO_COINGECKO = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  aapl: "apple",
  msft: "microsoft",
  amzn: "amazon"
};

async function handleMarket(symbol) {
  const cgId = SYMBOL_TO_COINGECKO[symbol];
  if (!cgId) {
    return jsonResponse(400, {
      status: "error",
      error: "Unknown symbol"
    });
  }

  const url =
    `https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await res.json();
    return jsonResponse(200, { status: "ok", data });
  } catch (err) {
    console.error("Market error:", err);
    return jsonResponse(502, {
      status: "error",
      error: err.message
    });
  }
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

  // JSON feeds
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

  // Fallback feeds
  if (target.startsWith("fallback:")) {
    const fbKey = target.slice(9);
    return await handleFallback(fbKey);
  }

  // RSS feeds
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
// Health Handler (Safe + Stable)
// ------------------------------------------------------------
async function handleHealth() {
  const checkFeed = async (key, val) => {
    try {
      if (typeof val !== "string") return [key, "error"];

      if (val.startsWith("fallback:")) return [key, "fallback"];
      if (val.startsWith("json:")) return [key, "json"];

      // Use GET instead of HEAD — more widely supported
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(val, {
        method: "GET",
        signal: controller.signal
      });

      clearTimeout(timeout);

      return [key, res.ok ? "ok" : "error"];
    } catch {
      return [key, "error"];
    }
  };

  const entries = await Promise.all(
    Object.entries(FEEDS).map(([key, val]) => checkFeed(key, val))
  );

  const status = {};
  for (const [k, v] of entries) status[k] = v;

  return jsonResponse(200, { status: "ok", feeds: status });
}

// ------------------------------------------------------------
// Lambda Entry
// ------------------------------------------------------------
export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(200, { status: "ok" });
    }

    const qs = event.queryStringParameters || {};
    const mode = qs.mode || "rss";

    if (mode === "health") return await handleHealth();

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
