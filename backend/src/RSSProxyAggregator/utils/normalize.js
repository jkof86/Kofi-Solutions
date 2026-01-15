// ------------------------------------------------------------
// normalize.js — v1.300 (FAST‑MODE SAFE + Hardened Normalization)
// ------------------------------------------------------------
//
// Purpose:
//   Normalize raw RSS/JSON/fallback items into a consistent,
//   frontend-safe shape for FeedCard rendering.
//
// Fully compatible with:
//   • rssParser.js v2.4 (FAST + FULL modes)
//   • handleFeed.js v1.302 (enrichment pipeline)
//   • FeedCard v1.400
//
// Improvements in v1.300:
//   ✓ FAST‑mode safe (raw RSS items won't break normalization)
//   ✓ Hardened HTML stripping (CDATA, tags, whitespace)
//   ✓ More resilient image extraction
//   ✓ More resilient description extraction
//   ✓ Better URL extraction (handles objects + arrays)
//   ✓ Better date extraction
//   ✓ Cleaner fallback behavior
//
// ------------------------------------------------------------


// ------------------------------------------------------------
// stripCdata(html)
// ------------------------------------------------------------
function stripCdata(html) {
  return typeof html === "string"
    ? html.replace(/<!\[CDATA\[|\]\]>/g, "")  : "";
}


// ------------------------------------------------------------
// stripHtml(html)
// ------------------------------------------------------------
function stripHtml(html) {
  if (typeof html !== "string") return "";
  return stripCdata(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ------------------------------------------------------------
// extractImage(entry)
// ------------------------------------------------------------
function extractImage(entry = {}) {
  const matchImg = (html) => {
    if (typeof html !== "string") return null;
    const cleaned = stripCdata(html);

    // <img src="">
    let match = cleaned.match(/<img[^>]+src="([^">]+)"/i);
    if (match) return match[1];

    // <source srcset="">
    match = cleaned.match(/<source[^>]+srcset="([^">]+)"/i);
    if (match) return match[1];

    // <meta property="og:image">
    match = cleaned.match(/property="og:image"[^>]+content="([^">]+)"/i);
    if (match) return match[1];

    return null;
  };

  const getFirst = (val) => {
    if (!val) return null;
    if (Array.isArray(val)) return getFirst(val[0]);
    if (typeof val === "object" && val.url) return val.url;
    if (typeof val === "object" && val["@_url"]) return val["@_url"];
    if (typeof val === "object" && val["$"]?.url) return val["$"].url;
    return null;
  };

  return (
    entry.enclosure?.url ||
    getFirst(entry["media:content"]) ||
    getFirst(entry["media:thumbnail"]) ||
    matchImg(entry.description) ||
    matchImg(entry["content:encoded"]) ||
    null
  );
}


// ------------------------------------------------------------
// extractUrl(entry)
// ------------------------------------------------------------
function extractUrl(entry = {}) {
  if (typeof entry.link === "string") return entry.link;
  if (typeof entry.url === "string") return entry.url;
  if (typeof entry.guid === "string") return entry.guid;

  // Some feeds use objects for link
  if (entry.link?.href) return entry.link.href;

  return "#";
}


// ------------------------------------------------------------
// generateSummaryFromContent(entry)
// ------------------------------------------------------------
function generateSummaryFromContent(entry = {}) {
  const html =
    entry["content:encoded"] ||
    entry.description ||
    entry.summary ||
    "";

  const text = stripHtml(html);
  if (!text) return "";

  const sentences = text.split(/(?<=[.!?])\s+/);
  const summary = sentences.slice(0, 2).join(" ");

  return summary.length > 20 ? summary : "";
}


// ------------------------------------------------------------
// extractDescription(entry)
// ------------------------------------------------------------
function extractDescription(entry = {}) {
  const raw =
    entry.summary ||
    entry.description ||
    entry["content:encoded"] ||
    "";

  if (typeof raw !== "string" || raw.trim() === "") {
    return generateSummaryFromContent(entry) || "";
  }

  const cleaned = stripHtml(raw);
  if (cleaned.length > 0) return cleaned;

  return generateSummaryFromContent(entry) || "";
}


// ------------------------------------------------------------
// extractDate(entry)
// ------------------------------------------------------------
function extractDate(entry = {}) {
  return entry.isoDate || entry.pubDate || entry.date || null;
}


// ------------------------------------------------------------
// normalizeItem(entry, source)
// ------------------------------------------------------------
function normalizeItem(entry = {}, source = "") {
  const description = extractDescription(entry);

  if (!description) {
    console.warn("[NO SUMMARY]", source, {
      hasSummary: !!entry.summary,
      hasDescription: !!entry.description,
      hasContentEncoded: !!entry["content:encoded"],
      title: entry.title
    });
  }

  return {
    title: entry.title || "Untitled",
    url: extractUrl(entry),
    description,
    image: extractImage(entry),
    date: extractDate(entry),
    source: source || "unknown",
    raw: entry
  };
}


// ------------------------------------------------------------
// normalizeItems(items, source)
// ------------------------------------------------------------
function normalizeItems(items = [], source = "") {
  if (!Array.isArray(items)) return [];
  return items.map((item) => normalizeItem(item, source));
}


module.exports = {
  normalizeItems,
  normalizeItem,
  extractImage
};
