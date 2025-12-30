// ------------------------------------------------------------
// sanitizeFeeds.js — v1.180 (Correct Flattening + Safe Builder)
// ------------------------------------------------------------
//
// Input FEEDS shape (frontend):
//   {
//     crypto: [ { id, name, url, type }, ... ],
//     finance: [ ... ],
//     ...
//   }
//
// Output CLEAN_FEEDS shape (flat):
//   {
//     coindesk: { id, name, label, url, type, category, categories },
//     cointelegraph: { ... },
//     ...
//   }
//
// This is the format TabsLayout, FeedStatusBar, and MarketChart expect.
//
// ------------------------------------------------------------

export function sanitizeFeeds(nestedFeeds) {
  if (!nestedFeeds || typeof nestedFeeds !== "object") return {};

  const flat = {};

  for (const category of Object.keys(nestedFeeds)) {
    const arr = nestedFeeds[category];

    if (!Array.isArray(arr)) continue;

    for (const f of arr) {
      if (!f || typeof f !== "object") continue;

      // Required fields
      if (!f.id || !f.url || !f.type) continue;

      // Valid type
      if (!["rss", "json"].includes(f.type)) continue;

      // Normalize label/name
      const label = f.label || f.name || f.id;

      flat[f.id] = {
        id: f.id,
        label,
        name: f.name || label,
        url: f.url,
        type: f.type,
        category,
        categories: f.categories || [category]
      };
    }
  }

  return flat;
}
