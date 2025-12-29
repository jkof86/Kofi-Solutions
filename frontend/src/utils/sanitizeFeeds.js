// ------------------------------------------------------------
// sanitizeFeeds.js — Frontend FEEDS Normalizer
// ------------------------------------------------------------
//
// Purpose:
//   - Ensure FEEDS is always safe for UI rendering
//   - Remove invalid categories
//   - Remove invalid feed objects
//   - Hide "dead_feeds" category from UI
//   - Guarantee FEEDS[category] is always an array
//
// This prevents UI crashes when auto-fix rewrites FEEDS.
// ------------------------------------------------------------

export function sanitizeFeeds(FEEDS) {
  const clean = {};

  for (const category of Object.keys(FEEDS)) {
    const feeds = FEEDS[category];

    // Hide dead feeds from UI
    if (category === "dead_feeds") continue;

    // Ensure category is an array
    if (!Array.isArray(feeds)) {
      clean[category] = [];
      continue;
    }

    // Filter out invalid feed objects
    clean[category] = feeds.filter(
      (f) =>
        f &&
        typeof f.id === "string" &&
        typeof f.url === "string" &&
        f.url.length > 0
    );
  }

  return clean;
}
