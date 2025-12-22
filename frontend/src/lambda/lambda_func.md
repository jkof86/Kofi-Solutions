// index.js — Hybrid RSS proxy with Coinbase API override
// - Normal RSS/Atom parsing for most feeds
// - Coinbase uses API → HTML → generic fallback
// - Inline image stripping removes all images EXCEPT GIFs
// - Fully AWS-safe (no regex literals, no smart quotes)

const FEEDS = {
  jcg: "https://www.javacodegeeks.com/feed",
  infoq_java: "https://feed.infoq.com/java",

  dark_reading: "https://www.darkreading.com/rss.xml",
  security_week: "https://www.securityweek.com/feed",
  krebs: "https://krebsonsecurity.com/feed/",

  iot_world: "https://www.iotworldtoday.com/feed",
  stacey_iot: "https://staceyoniot.com/feed/",
  iot_business: "https://iotbusinessnews.com/feed/",

  spring_blog: "https://spring.io/blog.atom",
  spring_guides: "https://spring.io/guides.atom",

  aws_news: "https://aws.amazon.com/blogs/aws/feed/",
  aws_arch: "https://aws.amazon.com/blogs/architecture/feed/",
  aws_security: "https://aws.amazon.com/blogs/security/feed/",

  react_status: "https://react.statuscode.com/feed",
  logrocket_react: "https://blog.logrocket.com/tag/react/feed/",
  smashing_react: "https://www.smashingmagazine.com/tag/react/feed/",

  espn: "https://www.espn.com/espn/rss/news",
  cbs_sports: "https://www.cbssports.com/rss/headlines/",
  bleacher: "https://bleacherreport.com/articles/feed",

  marketwatch: "https://www.marketwatch.com/feeds/topstories",
  investopedia: "https://www.investopedia.com/feedbuilder/feedbuilder.rss",
  seeking_alpha: "https://seekingalpha.com/market_currents.xml",

  reuters_world: "https://feeds.reuters.com/Reuters/worldNews",
  bbc_world: "https://feeds.bbci.co.uk/news/world/rss.xml",
  ap_world: "https://www.apnews.com/apf-intlnews?format=xml",

  cd: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  ct: "https://cointelegraph.com/rss",
  cb: "https://blog.coinbase.com/",
  decrypt: "https://decrypt.co/feed"
};

const SYMBOL_TO_COINGECKO = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana"
};

// ---------- Helpers ----------

// Strip all inline images EXCEPT GIFs
function stripInlineImages(html) {
  if (!html) return html;

  // Remove <img> tags that are NOT GIFs
  return html.replace(
    new RegExp("<img[^>]*src=\\\"(?![^\\\"]+\\.gif)[^\\\"]+\\\"[^>]*>", "gi"),
    ""
  );
}

function stripCdata(str) {
  if (!str) return str;
  const open = new RegExp("<!\\[CDATA\\[", "g");
  const close = new RegExp("\\]\\]>", "g");
  return str.replace(open, "").replace(close, "").trim();
}

function extractImageFromXml(xml) {
  if (!xml) return null;

  const patterns = [
    new RegExp("<media:content[^>]*url=\\\"([^\\\"]+)\\\"", "i"),
    new RegExp("<media:thumbnail[^>]*url=\\\"([^\\\"]+)\\\"", "i"),
    new RegExp("<enclosure[^>]*url=\\\"([^\\\"]+)\\\"", "i"),
    new RegExp("<img[^>]*src=\\\"([^\\\"]+)\\\"", "i")
  ];

  for (const p of patterns) {
    const m = xml.match(p);
    if (m) return m[1];
  }

  return null;
}

// ---------- RSS/Atom Parsing ----------

function parseRss(xml) {
  const items = [];

  // RSS <item>
  if (xml.includes("<item")) {
    const itemRegex = new RegExp("<item[\\s\\S]*?<\\/item>", "gi");
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[0];

      const getTag = (tag) => {
        const r = new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "i");
        const m = block.match(r);
        return m ? stripCdata(m[1].trim()) : null;
      };

      const rawSummary = getTag("description") || getTag("summary");
      const cleanSummary = stripInlineImages(rawSummary);

      items.push({
        title: getTag("title"),
        url: getTag("link"),
        summary: cleanSummary,
        content_html: cleanSummary,
        date_published: getTag("pubDate") || getTag("updated") || getTag("dc:date"),
        image: extractImageFromXml(block)
      });
    }

    return items;
  }

  // Atom <entry>
  if (xml.includes("<entry")) {
    const entryRegex = new RegExp("<entry[\\s\\S]*?<\\/entry>", "gi");
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
      const block = match[0];

      const getTag = (tag) => {
        const r = new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "i");
        const m = block.match(r);
        return m ? stripCdata(m[1].trim()) : null;
      };

      const rawSummary = getTag("summary") || getTag("content");
      const cleanSummary = stripInlineImages(rawSummary);

      const linkMatch = block.match(
        new RegExp("<link[^>]*href=\\\"([^\\\"]+)\\\"", "i")
      );

      items.push({
        title: getTag("title"),
        url: linkMatch ? linkMatch[1] : null,
        summary: cleanSummary,
        content_html: cleanSummary,
        date_published: getTag("updated") || getTag("published"),
        image: extractImageFromXml(block)
      });
    }

    return items;
  }

  return items;
}

// ---------- HTML Fallback ----------

function buildHtmlFallbackItem(url, html, source) {
  const titleMatch = html.match(
    new RegExp("<title[^>]*>([\\s\\S]*?)<\\/title>", "i")
  );
  const title = titleMatch ? stripCdata(titleMatch[1]) : `Feed: ${source}`;

  const text = html
    .replace(new RegExp("<script[\\s\\S]*?<\\/script>", "gi"), "")
    .replace(new RegExp("<style[\\s\\S]*?<\\/style>", "gi"), "")
    .replace(new RegExp("<[^>]+>", "g"), " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

  const summary = text || "Feed returned HTML but no recognizable RSS/Atom entries.";

  return {
    title,
    url,
    summary,
    content_html: stripInlineImages(html),
    date_published: null,
    image: null
  };
}

// ---------- Coinbase Hybrid Parser ----------

// Parse Coinbase API JSON
function parseCoinbaseApiJson(json) {
  const posts = json && (json.data || json.posts || json.items || []);
  if (!Array.isArray(posts)) return [];

  return posts.map((p) => {
    const title = p.title || p.name || "Coinbase Post";

    let url = p.url || p.link || null;
    if (!url && p.path) url = "https://www.coinbase.com" + p.path;

    const summary =
      p.summary || p.description || p.subtitle || "Coinbase Blog article";

    const image =
      (p.image && (p.image.url || p.image.src)) ||
      p.hero_image_url ||
      p.header_image_url ||
      null;

    const date =
      p.published_at ||
      p.created_at ||
      p.updated_at ||
      null;

    return {
      title,
      url,
      summary,
      content_html: stripInlineImages(summary),
      date_published: date,
      image
    };
  });
}

// Parse Coinbase HTML meta tags
function parseCoinbaseHtml(html, feedUrl) {
  const titleMatch =
    html.match(
      new RegExp("<meta[^>]*property=\\\"og:title\\\"[^>]*content=\\\"([^\\\"]+)\\\"", "i")
    ) ||
    html.match(new RegExp("<title[^>]*>([\\s\\S]*?)<\\/title>", "i"));

  const title = titleMatch ? stripCdata(titleMatch[1]) : "Coinbase Blog";

  const descMatch = html.match(
    new RegExp("<meta[^>]*property=\\\"og:description\\\"[^>]*content=\\\"([^\\\"]+)\\\"", "i")
  );
  const summary = descMatch ? descMatch[1] : "Coinbase Blog article";

  const imgMatch = html.match(
    new RegExp("<meta[^>]*property=\\\"og:image\\\"[^>]*content=\\\"([^\\\"]+)\\\"", "i")
  );
  const image = imgMatch ? imgMatch[1] : null;

  return [
    {
      title,
      url: feedUrl,
      summary,
      content_html: stripInlineImages(summary),
      date_published: null,
      image
    }
  ];
}

// Coinbase handler: API → HTML → fallback
async function handleCoinbase() {
  const apiUrl = "https://www.coinbase.com/api/v2/blog/posts?limit=20";
  const fallbackHtmlUrl = FEEDS.cb;

  // Try API first
  try {
    const apiRes = await fetch(apiUrl);
    const apiText = await apiRes.text();

    if (apiRes.ok) {
      let json = null;
      try {
        json = JSON.parse(apiText);
      } catch {}

      if (json) {
        const items = parseCoinbaseApiJson(json);
        if (items.length > 0) {
          return jsonResponse(200, { status: "ok", items });
        }
      }
    }
  } catch {}

  // HTML fallback
  try {
    const htmlRes = await fetch(fallbackHtmlUrl);
    const html = await htmlRes.text();

    if (htmlRes.ok && html) {
      let items = parseCoinbaseHtml(html, fallbackHtmlUrl);
      if (!items || items.length === 0) {
        items = [buildHtmlFallbackItem(fallbackHtmlUrl, html, "cb")];
      }
      return jsonResponse(200, { status: "ok", items });
    }

    return jsonResponse(htmlRes.status || 502, {
      status: "error",
      error: "Coinbase HTML fetch failed"
    });
  } catch (err) {
    return jsonResponse(502, {
      status: "error",
      error: "Coinbase handler error: " + err.message
    });
  }
}

// ---------- Generic Handlers ----------

async function handleRss(source) {
  if (source === "cb") return await handleCoinbase();

  const feedUrl = FEEDS[source];
  if (!feedUrl) {
    return jsonResponse(400, { status: "error", error: "Unknown feed: " + source });
  }

  try {
    const res = await fetch(feedUrl);
    const text = await res.text();

    if (!res.ok) {
      return jsonResponse(res.status, {
        status: "error",
        error: "Upstream error",
        code: res.status
      });
    }

    let items = parseRss(text);

    if (!items || items.length === 0) {
      items = [buildHtmlFallbackItem(feedUrl, text, source)];
    }

    return jsonResponse(200, { status: "ok", items });
  } catch (err) {
    return jsonResponse(502, {
      status: "error",
      error: err.message
    });
  }
}

async function handleHealth() {
  const entries = await Promise.all(
    Object.entries(FEEDS).map(async ([key, url]) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        return [key, res.ok ? "ok" : "error:" + res.status];
      } catch {
        return [key, "error"];
      }
    })
  );

  const status = {};
  for (const [k, v] of entries) status[k] = v;

  return jsonResponse(200, { status: "ok", feeds: status });
}

async function handleMarket(symbol) {
  const cgId = SYMBOL_TO_COINGECKO[symbol];
  if (!cgId) {
    return jsonResponse(400, { status: "error", error: "Unknown symbol" });
  }

  const url =
    "https://api.coingecko.com/api/v3/coins/" +
    cgId +
    "/market_chart?vs_currency=usd&days=1";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return jsonResponse(res.status, {
        status: "error",
        error: "CoinGecko error"
      });
    }

    return jsonResponse(200, { status: "ok", data: await res.json() });
  } catch (err) {
    return jsonResponse(502, {
      status: "error",
      error: err.message
    });
  }
}

// ---------- JSON Response Helper (MUST BE ABOVE HANDLER) ----------

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS"
    },
    body: JSON.stringify(payload)
  };
}

// ---------- Main Handler ----------

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return jsonResponse(200, { status: "ok" });
    }

    const qs = event.queryStringParameters || {};
    const mode = qs.mode || "rss";

    if (mode === "health") return await handleHealth();
    if (mode === "market") return await handleMarket(qs.symbol);

    return await handleRss(qs.source);
  } catch (err) {
    return jsonResponse(502, {
      status: "error",
      error: err.message
    });
  }
};
