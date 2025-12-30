// ------------------------------------------------------------
// sanitizeFeeds.js — v1.195 (Flat FEEDS Compatible)
// ------------------------------------------------------------
//
// Input FEEDS shape (frontend):
//   {
//     coindesk: { id, name, url, type, category },
//     cointelegraph: { ... },
//     ...
//   }
//
// Output CLEAN_FEEDS shape (flat):
//   {
//     coindesk: { id, name, label, url, type, category, categories },
//     ...
//   }
//
// ------------------------------------------------------------

export function sanitizeFeeds(flatFeeds) {
  if (!flatFeeds || typeof flatFeeds !== "object") return {};

  const clean = {};

  for (const feedId of Object.keys(flatFeeds)) {
    const f = flatFeeds[feedId];
    if (!f || typeof f !== "object") continue;

    // Required fields
    if (!f.id || !f.url || !f.type) continue;

    // Valid type
    if (!["rss", "json"].includes(f.type)) continue;

    const category = f.category || "uncategorized";
    const label = f.label || f.name || f.id;

    clean[f.id] = {
      id: f.id,
      label,
      name: f.name || label,
      url: f.url,
      type: f.type,
      category,
      categories: f.categories || [category]
    };
  }

  return clean;
}
