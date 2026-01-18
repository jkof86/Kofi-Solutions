// ------------------------------------------------------------
// rssParser.js — v2.3
// High‑success RSS parser with HTML tolerance + regex fallback
// ------------------------------------------------------------
//
// Goals:
//   ✓ Load as many feeds as possible (Bloomberg, ESPN, etc.)
//   ✓ Softened binary detection
//   ✓ Accept HTML if it contains <item> blocks
//   ✓ Regex fallback when XML parsing fails
//   ✓ Fast health mode (no XML parsing)
//   ✓ Never hang (timeouts everywhere)
//   ✓ Partial extraction > total failure
//
// ------------------------------------------------------------

const axios = require("axios");
const xml2js = require("xml2js");

// ------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------
const FETCH_TIMEOUT_MS = 2500;     // Slightly higher for flaky feeds
const PARSE_TIMEOUT_MS = 2000;
const MAX_XML_SIZE = 3_000_000;    // Allow larger feeds

// ------------------------------------------------------------
// Safe fetch wrapper
// ------------------------------------------------------------
async function safeFetch(url, feedId) {
  try {
    const res = await axios.get(url, {
      timeout: FETCH_TIMEOUT_MS,
      responseType: "text",
      decompress: true,
      validateStatus: () => true
    });

    if (!res || typeof res.data !== "string") {
      console.warn(`[rssParser] ${feedId} returned non-string body`);
      return null;
    }

    const body = res.data;

    // Allow UTF‑8 BOM, tabs, newlines
    const firstChar = body.charCodeAt(0);
    if (firstChar < 9 && firstChar !== 0xfeff) {
      console.warn(`[rssParser] ${feedId} returned binary-like content`);
      // But DO NOT reject — try regex fallback later
    }

    // Size cap
    if (body.length > MAX_XML_SIZE) {
      console.warn(`[rssParser] ${feedId} XML too large (${body.length} bytes)`);
      return body.slice(0, MAX_XML_SIZE);
    }

    return body;
  } catch (err) {
    console.warn(`[rssParser] fetch error for ${feedId}:`, String(err));
    return null;
  }
}

// ------------------------------------------------------------
// Safe XML parse wrapper
// ------------------------------------------------------------
async function safeParseXml(xml, feedId) {
  return Promise.race([
    new Promise((resolve, reject) => {
      xml2js.parseString(
        xml,
        {
          trim: true,
          normalize: true,
          explicitArray: false,
          mergeAttrs: true
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`XML parse timeout for ${feedId}`)), PARSE_TIMEOUT_MS)
    )
  ]).catch((err) => {
    console.warn(`[rssParser] XML parse error for ${feedId}:`, String(err));
    return null;
  });
}

// ------------------------------------------------------------
// Regex fallback: extract <item> blocks manually
// ------------------------------------------------------------
function regexExtractItems(xml, feedId) {
  try {
    const blocks = xml.match(/<item[\s\S]*?<\/item>/gi);
    if (!blocks || blocks.length === 0) return [];

    return blocks.map((block) => {
      const title = (block.match(/<title>([\s\S]*?)<\/title>/i) || [null, ""])[1]
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .trim();

      const link = (block.match(/<link>([\s\S]*?)<\/link>/i) || [null, ""])[1]
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .trim();

      const description = (block.match(/<description>([\s\S]*?)<\/description>/i) || [null, ""])[1]
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .trim();

      return {
        title,
        url: link,
        description,
        published: null,
        image: null,
        raw: { title, link, description }
      };
    });
  } catch (err) {
    console.warn(`[rssParser] regex fallback failed for ${feedId}:`, String(err));
    return [];
  }
}

// ------------------------------------------------------------
// Normalize XML → items[]
// ------------------------------------------------------------
function normalizeRss(json, feedId) {
  if (!json) return [];

  // RSS 2.0
  if (json.rss?.channel?.item) {
    const items = Array.isArray(json.rss.channel.item)
      ? json.rss.channel.item
      : [json.rss.channel.item];

    return items.map((raw) => ({
      title: raw.title || "",
      url: raw.link || raw.guid || "",
      description: raw.description || "",
      published: raw.pubDate || raw.published || null,
      image: raw.enclosure?.url || null,
      raw
    }));
  }

  // Atom
  if (json.feed?.entry) {
    const items = Array.isArray(json.feed.entry)
      ? json.feed.entry
      : [json.feed.entry];

    return items.map((raw) => ({
      title: raw.title?._ || raw.title || "",
      url: raw.link?.href || raw.id || "",
      description: raw.summary?._ || raw.summary || "",
      published: raw.updated || raw.published || null,
      image: null,
      raw
    }));
  }

  return [];
}

// ------------------------------------------------------------
// MAIN PARSER
// ------------------------------------------------------------
async function rssParser(url, feedId, isHealthMode = false) {
  console.log(`[rssParser] START feed=${feedId} health=${isHealthMode}`);

  const xml = await safeFetch(url, feedId);
  if (!xml) return { items: [] };

  // ------------------------------------------------------------
  // HEALTH MODE — FAST PATH
  // ------------------------------------------------------------
  if (isHealthMode) {
    const count = (xml.match(/<item[\s>]/g) || []).length;
    return { items: new Array(count).fill({}) };
  }

  // ------------------------------------------------------------
  // FULL MODE — TRY XML PARSE FIRST
  // ------------------------------------------------------------
  const json = await safeParseXml(xml, feedId);

  if (json) {
    const items = normalizeRss(json, feedId);
    if (items.length > 0) {
      console.log(`[rssParser] XML SUCCESS feed=${feedId} count=${items.length}`);
      return { items };
    }
  }

  // ------------------------------------------------------------
  // FALLBACK: HTML or malformed XML → regex extraction
  // ------------------------------------------------------------
  const regexItems = regexExtractItems(xml, feedId);

  if (regexItems.length > 0) {
    console.warn(
      `[rssParser] FALLBACK SUCCESS feed=${feedId} extracted=${regexItems.length}`
    );
    return { items: regexItems };
  }

  console.warn(`[rssParser] TOTAL FAILURE feed=${feedId}`);
  return { items: [] };
}

module.exports = { rssParser };
