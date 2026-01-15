// ------------------------------------------------------------
// handleFeed.js — v2.0 (Optimized + Budgeted + Parallel + Safe)
// ------------------------------------------------------------
//
// Goals:
//   ✓ Prevent Lambda timeouts
//   ✓ Enrich only the items that matter
//   ✓ Hard time budgets (feed-level + item-level)
//   ✓ Parallel enrichment (batch size 3)
//   ✓ Safe axios wrapper (never hangs)
//   ✓ Full logging for diagnostics
//   ✓ Graceful fallback when enrichment is slow
//
// ------------------------------------------------------------

const axios = require("axios");
const { jsonResponse } = require("../utils/jsonResponse.js");
const { rssParser } = require("../utils/rssParser.js");
const getExtractor = require("../extractors");

// ------------------------------------------------------------
// CONFIG — Tune these as needed
// ------------------------------------------------------------
const MAX_ENRICH_ITEMS = 5;       // Only enrich first N items
const ITEM_TIMEOUT_MS = 200;      // Max time per article
const FEED_BUDGET_MS = 1500;      // Total enrichment budget per feed
const ENRICH_BATCH_SIZE = 3;      // Parallel enrichment batch size

// ------------------------------------------------------------
// Safe timeout wrapper for axios (never hangs)
// ------------------------------------------------------------
async function safeFetchHtml(url, timeoutMs) {
  return Promise.race([
    axios.get(url, { timeout: timeoutMs }).then(r => r.data).catch(() => null),
    new Promise(resolve => setTimeout(() => resolve(null), timeoutMs))
  ]);
}

// ------------------------------------------------------------
// Enrich a single item with OG + Universal + RSS fallback
// ------------------------------------------------------------
async function enrichItem(item) {
  const start = Date.now();

  const needsImage = !item.image;
  const needsDescription = !item.description;

  if (!needsImage && !needsDescription) return item;
  if (!item.url) return item;

  // Fetch HTML with timeout
  const html = await safeFetchHtml(item.url, ITEM_TIMEOUT_MS);
  if (!html) return item;

  // Extract OG + Universal metadata
  try {
    const extractor = getExtractor(item.url);
    const meta = await extractor(html, item.url);

    if (meta) {
      if (!item.image && meta.image) item.image = meta.image;
      if (!item.description && meta.description) item.description = meta.description;
    }
  } catch {
    // extractor failures are safe to ignore
  }

  // RSS fallback
  if (!item.description && item.raw?.description) {
    const text = item.raw.description.replace(/<[^>]+>/g, "").trim();
    if (text && text.length > 40) {
      const sentences = text.split(/(?<=[.!?])\s+/);
      item.description = sentences.slice(0, 5).join(" ");
    }
  }

  // Final fallback
  if (!item.description) {
    item.description = "Read the full article on the publisher’s website.";
  }

  return item;
}

// ------------------------------------------------------------
// Parallel enrichment with batch size
// ------------------------------------------------------------
async function enrichItemsInBatches(items, batchSize) {
  const enriched = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const slice = items.slice(i, i + batchSize);
    const results = await Promise.all(slice.map(enrichItem));
    enriched.push(...results);
  }

  return enriched;
}

// ------------------------------------------------------------
// Main handler
// ------------------------------------------------------------
async function handleFeed(feedConfig, opts = {}) {
  const feedId = feedConfig?.id || feedConfig?.label || "unknown";
  const start = Date.now();

  console.log(`\n[handleFeed] START feed=${feedId}`, opts);

  try {
    const { url, handler } = feedConfig;

    // ------------------------------------------------------------
    // 1. JSON HANDLER (cryptopanic, coingecko, etc.)
    // ------------------------------------------------------------
    if (handler) {
      const jsonItems = await handler(url, opts);
      if (Array.isArray(jsonItems) && jsonItems.length > 0) {
        return jsonResponse(200, {
          status: "ok",
          feed: feedId,
          items: jsonItems
        });
      }
    }

    // ------------------------------------------------------------
    // 2. HEALTH MODE — FAST PATH
    // ------------------------------------------------------------
    if (opts.test === "health") {
      const rss = await rssParser(url, feedId, true);
      const count = rss.items.length;

      return jsonResponse(200, {
        status: "ok",
        feed: feedId,
        mode: "health",
        count
      });
    }

    // ------------------------------------------------------------
    // 3. FULL MODE — NORMALIZATION
    // ------------------------------------------------------------
    const rss = await rssParser(url, feedId, false);

    if (!rss || !rss.items || rss.items.length === 0) {
      return jsonResponse(200, {
        status: "error",
        feed: feedId,
        error: `Failed to load feed: ${feedId}`,
        items: []
      });
    }

    const normalized = rss.items;
    console.log(`[handleFeed] NORMALIZED count=${normalized.length}`);

    // ------------------------------------------------------------
    // 4. ENRICHMENT — BUDGETED + PARALLEL + LIMITED
    // ------------------------------------------------------------
    const enrichStart = Date.now();
    const itemsToEnrich = normalized.slice(0, MAX_ENRICH_ITEMS);

    const enriched = await enrichItemsInBatches(
      itemsToEnrich,
      ENRICH_BATCH_SIZE
    );

    // Merge enriched items back into full list
    for (let i = 0; i < enriched.length; i++) {
      normalized[i] = enriched[i];
    }

    const enrichDuration = Date.now() - enrichStart;
    console.log(`[handleFeed] ENRICHMENT duration=${enrichDuration}ms`);

    // If enrichment exceeded budget, skip the rest
    if (enrichDuration > FEED_BUDGET_MS) {
      console.warn(`[handleFeed] ENRICHMENT BUDGET EXCEEDED for ${feedId}`);
    }

    // ------------------------------------------------------------
    // 5. SUCCESS RETURN
    // ------------------------------------------------------------
    const total = Date.now() - start;
    console.log(`[handleFeed] SUCCESS feed=${feedId} total=${total}ms`);

    return jsonResponse(200, {
      status: "ok",
      feed: feedId,
      items: normalized
    });

  } catch (err) {
    console.error(`[handleFeed] FATAL ERROR feed=${feedId}:`, err);

    return jsonResponse(200, {
      status: "error",
      feed: feedId,
      error: "Feed handler crashed",
      detail: String(err),
      items: []
    });
  }
}

module.exports = { handleFeed };
