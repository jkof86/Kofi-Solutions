// utils/jsonParser.js (CommonJS)

const { normalizeItem } = require("./normalize.js");

function parseJsonFeed(jsonText) {
  if (!jsonText || typeof jsonText !== "string") return [];

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return [];
  }

  if (Array.isArray(data?.items)) {
    return data.items
      .map(raw => normalizeItem(raw, { sourceType: "jsonfeed" }))
      .filter(Boolean);
  }

  const rssItems = data?.rss?.channel?.item;
  if (rssItems) {
    const arr = Array.isArray(rssItems) ? rssItems : [rssItems];
    return arr.map(raw => normalizeItem(raw, { sourceType: "json_rss" })).filter(Boolean);
  }

  const atomEntries = data?.feed?.entry;
  if (atomEntries) {
    const arr = Array.isArray(atomEntries) ? atomEntries : [atomEntries];
    return arr.map(raw => normalizeItem(raw, { sourceType: "json_atom" })).filter(Boolean);
  }

  if (Array.isArray(data)) {
    return data
      .map(raw => normalizeItem(raw, { sourceType: "json_generic" }))
      .filter(Boolean);
  }

  return [];
}

module.exports = { parseJsonFeed };
