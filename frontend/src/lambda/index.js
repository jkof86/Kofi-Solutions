// ------------------------------------------------------------
// RSSProxyAggregator Lambda v2 (CommonJS)
// Node.js 18+/22+/24+
// Routes:
//   /?source=<feed>               → RSS mode (default)
//   /?mode=health                 → Health mode
//   /?mode=market&symbol=SPY      → Market mode
// ------------------------------------------------------------

const FEEDS = {
  jcg: "https://www.javacodegeeks.com/feed",
  cd: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  ct: "https://cointelegraph.com/rss",
  cb: "https://blog.coinbase.com/feed",

  iot_world: "https://www.iotworldtoday.com/feed",
  stacey_iot: "https://staceyoniot.com/feed/",
  iot_business: "https://iotbusinessnews.com/feed/",

  dark_reading: "https://www.darkreading.com/rss.xml",
  krebs: "https://krebsonsecurity.com/feed/",
  security_week: "https://feeds.feedburner.com/securityweek",

  infoq_java: "https://feed.infoq.com/java/",
  baeldung: "https://feeds.feedburner.com/Baeldung",

  spring_blog: "https://spring.io/blog.atom",
  spring_guides: "https://spring.io/guides.atom",

  aws_news: "https://aws.amazon.com/about-aws/whats-new/recent/feed/",
  aws_arch: "https://aws.amazon.com/blogs/architecture/feed/",
  aws_security: "https://aws.amazon.com/blogs/security/feed/",

  react_status: "https://react.statuscode.com/feed",
  logrocket_react: "https://blog.logrocket.com/tag/react/feed/",
  smashing_react: "https://www.smashingmagazine.com/tag/react/feed/",

  espn: "https://www.espn.com/espn/rss/news",
  cbs_sports: "https://www.cbssports.com/rss/headlines/",
  bleacher: "https://bleacherreport.com/articles/feed",

  marketwatch: "https://feeds.marketwatch.com/marketwatch/topstories/",
  ft: "https://www.ft.com/?format=rss",
  investopedia: "https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=news",

  yahoo_finance: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EDJI&region=US&lang=en-US",
  seeking_alpha: "https://seekingalpha.com/feed.xml?type=focus&category=us-stocks",
  marketwatch_stocks: "https://feeds.marketwatch.com/marketwatch/realtimeheadlines",

  decrypt: "https://decrypt.co/feed",

  federalist: "https://thefederalist.com/feed/",
  dailywire: "https://www.dailywire.com/feeds/rss.xml?limit=10",
  epoch: "https://www.theepochtimes.com/feed",

  reuters_world: "https://feeds.reuters.com/Reuters/worldNews",
  bbc_world: "http://feeds.bbci.co.uk/news/world/rss.xml",
  ap_world: "https://apnews.com/hub/ap-top-news?output=rss"
};

// Caches
const rssCache = new Map();
const healthCache = { data: null, timestamp: 0 };
const marketCache = new Map();

const CACHE_TTL_MS = 3 * 60 * 1000;
const HEALTH_TTL_MS = 2 * 60 * 1000;
const MARKET_TTL_MS = 60 * 1000;

// Header spoofing
const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
];

function pickUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function baseHeaders() {
  return {
    "User-Agent": pickUserAgent(),
    "Accept":
      "application/rss+xml, application/xml, text/xml, text/html;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Connection: "keep-alive"
  };
}

async function fetchWithRetries(url, extraHeaders = {}, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const headers = { ...baseHeaders(), ...extraHeaders };
      const res = await fetch(url, { headers });
      const text = await res.text();
      return { res, text };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

// RSS / Atom parser
function parseRss(text) {
  if (text.includes("<html") || text.includes("<!DOCTYPE html")) {
    throw new Error("HTMLResponse");
  }

  const cleaned = text.replace(/&#xD;/g, "").replace(/&nbsp;/g, " ");

  const items = [];

  // RSS <item>
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(cleaned)) !== null) {
    const xml = match[0];

    const getTag = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const m = xml.match(r);
      return m ? m[1].trim() : null;
    };

    const title = getTag("title");
    const link = getTag("link");
    const description = getTag("description") || getTag("content:encoded");
    const pubDate = getTag("pubDate");

    let image = null;
    const mediaMatch =
      xml.match(/<media:content[^>]*url="([^"]+)"/i) ||
      xml.match(/<enclosure[^>]*url="([^"]+)"/i);
    if (mediaMatch) image = mediaMatch[1];

    items.push({
      title,
      url: link,
      summary: description,
      content_html: description,
      date_published: pubDate,
      image
    });
  }

  if (items.length > 0) return items;

  // Atom <entry>
  const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
  while ((match = entryRegex.exec(cleaned)) !== null) {
    const xml = match[0];

    const getTag = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const m = xml.match(r);
      return m ? m[1].trim() : null;
    };

    const title = getTag("title");
    const linkMatch = xml.match(/<link[^>]*href="([^"]+)"/i);
    const link = linkMatch ? linkMatch[1] : null;
    const summary = getTag("summary") || getTag("content");
    const pubDate = getTag("updated") || getTag("published");

    let image = null;
    const mediaMatch = xml.match(/<media:content[^>]*url="([^"]+)"/i);
    if (mediaMatch) image = mediaMatch[1];

    items.push({
      title,
      url: link,
      summary,
      content_html: summary,
      date_published: pubDate,
      image
    });
  }

  return items;
}

// Fetch a single feed
async function fetchFeed(feedName) {
  const url = FEEDS[feedName];
  if (!url) {
    return {
      status: "error",
      error: `Unknown feed: ${feedName}`,
      items: [],
      latency: 0
    };
  }

  const cache = rssCache.get(feedName);
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return {
      status: "ok",
      items: cache.items,
      latency: cache.latency,
      fromCache: true
    };
  }

  const start = Date.now();

  try {
    const { res, text } = await fetchWithRetries(url, { Referer: url });

    if (!res.ok) {
      return {
        status: "error",
        error: `HTTP ${res.status}`,
        items: [],
        latency: Date.now() - start
      };
    }

    let items;
    try {
      items = parseRss(text);
    } catch (err) {
      if (err.message === "HTMLResponse") {
        return {
          status: "error",
          error: "HTML instead of RSS",
          items: [],
          latency: Date.now() - start
        };
      }
      throw err;
    }

    const latency = Date.now() - start;
    rssCache.set(feedName, { timestamp: Date.now(), items, latency });

    return { status: "ok", items, latency };
  } catch (err) {
    return {
      status: "error",
      error: err.message || "Unexpected error",
      items: [],
      latency: Date.now() - start
    };
  }
}

// Market fetch (Yahoo Finance proxy)
async function fetchMarket(symbol) {
  if (!symbol) {
    return { status: "error", error: "Missing symbol", data: [] };
  }

  const cache = marketCache.get(symbol);
  if (cache && Date.now() - cache.timestamp < MARKET_TTL_MS) {
    return { status: "ok", data: cache.data, fromCache: true };
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=15m&range=1d`;

  try {
    const { res, text } = await fetchWithRetries(url, { Referer: url });

    if (!res.ok) {
      return {
        status: "error",
        error: `HTTP ${res.status}`,
        data: []
      };
    }

    const json = JSON.parse(text);
    const result = json?.chart?.result?.[0];

    if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
      return {
        status: "error",
        error: "Invalid Yahoo Finance response",
        data: []
      };
    }

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    const data = timestamps
      .map((ts, i) => ({
        time: new Date(ts * 1000).toLocaleTimeString(),
        value: closes[i]
      }))
      .filter((d) => d.value != null);

    marketCache.set(symbol, { timestamp: Date.now(), data });

    return { status: "ok", data };
  } catch (err) {
    return {
      status: "error",
      error: err.message || "Unexpected error",
      data: []
    };
  }
}

// Handlers
async function handleRss(event) {
  const qs = event.queryStringParameters || {};
  const source = qs.source;

  if (!source) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing source parameter" })
    };
  }

  const result = await fetchFeed(source);

  return {
    statusCode: result.status === "ok" ? 200 : 502,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  };
}

async function handleHealth() {
  if (healthCache.data && Date.now() - healthCache.timestamp < HEALTH_TTL_MS) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(healthCache.data)
    };
  }

  const health = {};
  const latency = {};
  const names = Object.keys(FEEDS);

  await Promise.all(
    names.map(async (name) => {
      const result = await fetchFeed(name);
      health[name] = result.status === "ok" ? "ok" : result.error;
      latency[name] = result.latency;
    })
  );

  const payload = {
    health,
    latency,
    timestamp: Date.now()
  };

  healthCache.data = payload;
  healthCache.timestamp = Date.now();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
}

async function handleMarket(event) {
  const qs = event.queryStringParameters || {};
  const symbol = qs.symbol;

  const result = await fetchMarket(symbol);

  return {
    statusCode: result.status === "ok" ? 200 : 502,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  };
}

// Main handler
module.exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};
  const mode = qs.mode || "rss";

  if (mode === "health") return handleHealth();
  if (mode === "market") return handleMarket(event);

  return handleRss(event);
};
