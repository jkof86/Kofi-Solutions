// ------------------------------------------------------------
// handleFeed.js — v1.196 (Full Payload + Items Included)
// ------------------------------------------------------------
//
// Standardized return shape:
//
//   {
//     id,
//     status: "ok" | "fallback" | "dead",
//     fallback: Boolean,
//     count: Number,
//     type: "rss" | "json",
//     ok: Boolean,
//     items: Array,
//     error: String | null,
//     debug: Object | null
//   }
//
// Fixes in v1.196:
//   ✓ items returned for ALL states (ok, fallback, dead)
//   ✓ RSS parser errors fall back to HTML scraper
//   ✓ JSON feeds normalized safely
//   ✓ HEAD failures no longer kill feeds prematurely
//   ✓ Fully aligned with frontend RSSFeed v1.196
// ------------------------------------------------------------

const Parser = require("rss-parser");
const axios = require("axios");
const { normalizeItems } = require("../utils/normalize.js");
const { htmlFallback } = require("../utils/htmlFallback.js");


const parser = new Parser();

const HEAD_UNRELIABLE = new Set([
  "spring_cloud_blog",
  "spring_security_blog",
  "bleacher_report",
]);

async function safeHead(url, id, timeout = 1500) {
  if (HEAD_UNRELIABLE.has(id)) {
    return { ok: true, reason: "HEAD_UNRELIABLE" };
  }

  try {
    const res = await axios.head(url, {
      timeout,
      validateStatus: () => true,
    });

    if (res.status === 404 || res.status === 405) {
      return { ok: true, reason: "HEAD_UNSUPPORTED" };
    }

    if (res.status >= 400) {
      return { ok: false, reason: `HEAD_${res.status}` };
    }

    return { ok: true, reason: "HEAD_OK" };
  } catch (err) {
    return { ok: false, reason: err.code || err.message };
  }
}

async function handleFeed(feedConfig, opts = {}) {
  const id = feedConfig?.id;
  const url = feedConfig?.url;
  const type = feedConfig?.type || "rss";

  console.log("[handleFeed] feedId:", id, "opts:", opts);

  if (!id || !url) {
    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      items: [],
      type,
      ok: false,
      error: "INVALID_FEED",
      debug: null
    };
  }

  const head = await safeHead(url, id);

  if (!head.ok) {
    console.warn("[handleFeed][HEAD_FAIL]", id, head.reason);
  }

  try {
    // ------------------------------------------------------------
    // RSS FEED
    // ------------------------------------------------------------
    if (type === "rss") {
      try {
        const feedData = await parser.parseURL(url);
        const items = Array.isArray(feedData.items) ? feedData.items : [];

        const normalized = opts.raw ? items : normalizeItems(items, id);

        return {
          id,
          status: "ok",
          fallback: false,
          count: normalized.length,
          items: normalized,
          type: "rss",
          ok: true,
          error: null,
          debug: opts.debug ? { head } : null
        };


      } catch (rssErr) {
        console.warn("[handleFeed][RSS_PARSE_FAIL]", id, rssErr.message);

        try {
          const fallbackItems = await htmlFallback(url);
          return {
            id,
            status: "fallback",
            fallback: true,
            count: fallbackItems.length,
            items: fallbackItems,
            type: "rss",
            ok: true,
            error: null,
            debug: opts.debug ? { head, rssErr } : null
          };
        } catch (htmlErr) {
          return {
            id,
            status: "dead",
            fallback: false,
            count: 0,
            items: [],
            type: "rss",
            ok: false,
            error: htmlErr.message,
            debug: opts.debug ? { head, rssErr, htmlErr } : null
          };
        }
      }
    }

    // ------------------------------------------------------------
    // JSON FEED
    // ------------------------------------------------------------
    if (type === "json") {
      const res = await axios.get(url, { timeout: 3000 });

      const raw = res.data;
      const items =
        Array.isArray(raw?.data) ? raw.data :
          Array.isArray(raw?.items) ? raw.items :
            Array.isArray(raw) ? raw :
              [];

      const normalized = opts.raw ? items : normalizeItems(items, id);

      return {
        id,
        status: "ok",
        fallback: false,
        count: normalized.length,
        items: normalized,
        type: "json",
        ok: true,
        error: null,
        debug: opts.debug ? { head, raw } : null
      };

    }

    // ------------------------------------------------------------
    // INVALID TYPE
    // ------------------------------------------------------------
    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      items: [],
      type,
      ok: false,
      error: "INVALID_TYPE",
      debug: opts.debug ? { head } : null
    };

  } catch (err) {
    console.error("[handleFeed][FETCH_ERROR]", id, err.message);

    return {
      id,
      status: "dead",
      fallback: false,
      count: 0,
      items: [],
      type,
      ok: false,
      error: err.message,
      debug: opts.debug ? { head, err } : null
    };
  }
}

module.exports = { handleFeed };
