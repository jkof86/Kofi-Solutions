// ------------------------------------------------------------
// normalize.js — v1.206 (Clean Summary + Correct Title + CDATA Hardened)
// ------------------------------------------------------------
//
// Purpose:
//   Normalize raw RSS/JSON/fallback items into a consistent,
//   frontend-safe shape for FeedCard rendering.
//
// Standardized output shape:
//   {
//     title: string,
//     url: string,
//     description: string,
//     image: string | null,
//     date: string | null,
//     source: string,
//     raw: object
//   }
//
// Improvements in v1.206:
//   ✓ FIXED: title was incorrectly hardcoded ("entry.title")
//   ✓ Description never falls back to title
//   ✓ Blank description allowed
//   ✓ Auto-summary when possible
//   ✓ Image extraction hardened (CDATA + HTML)
//   ✓ Debug logging for missing summaries
//
// ------------------------------------------------------------


// ------------------------------------------------------------
// extractImage(entry)
// ------------------------------------------------------------
function extractImage(entry = {}) {
  const stripCdata = (html) =>
    typeof html === "string"
      ? html.replace(/<!\[CDATA\[|\]\]>/g, "")
      : "";

  const matchImg = (html) => {
    if (typeof html !== "string") return null;
    const cleaned = stripCdata(html);

    // 1. Standard <img src="">
    let match = cleaned.match(/<img[^>]+src="([^">]+)"/i);
    if (match) return match[1];

    // 2. <source srcset="">
    match = cleaned.match(/<source[^>]+srcset="([^">]+)"/i);
    if (match) return match[1];

    // 3. OpenGraph <meta property="og:image">
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
    // 1. enclosure
    entry.enclosure?.url ||

    // 2. media:content (object or array)
    getFirst(entry["media:content"]) ||

    // 3. media:thumbnail (object or array)
    getFirst(entry["media:thumbnail"]) ||

    // 4. <img> inside description
    matchImg(entry.description) ||

    // 5. <img> inside content:encoded
    matchImg(entry["content:encoded"]) ||

    null
  );
}


// ------------------------------------------------------------
// extractUrl(entry)
// ------------------------------------------------------------
function extractUrl(entry = {}) {
  return entry.link || entry.url || entry.guid || "#";
}


// ------------------------------------------------------------
// generateSummaryFromContent(entry)
// ------------------------------------------------------------
function generateSummaryFromContent(entry = {}) {
  const html =
    entry["content:encoded"] ||
    entry.description ||
    "";

  if (typeof html !== "string") return "";

  const text = html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

  // If raw is empty → try auto-summary
  if (typeof raw !== "string" || raw.trim() === "") {
    return generateSummaryFromContent(entry) || "";
  }

  // Strip HTML
  const cleaned = raw
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();

  if (cleaned.length > 0) return cleaned;

  // Final fallback
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
