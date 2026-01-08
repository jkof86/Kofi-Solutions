// ------------------------------------------------------------
// feedsHelpers.js — v1.180 (Category + Lookup Utilities)
// ------------------------------------------------------------
//
// Utilities for working with FEEDS:
//   • getFeedsForCategory(categoryId)
//   • getAllCategories()
//   • getFeedMetadata(feedId)
//
// Fully AWS-safe, pure functions, no side effects.
// ------------------------------------------------------------

const { FEEDS } = require("./feedsMap.js");

// ------------------------------------------------------------
// getFeedsForCategory(categoryId)
// ------------------------------------------------------------
// Returns an array of feed objects belonging to the category.
// Example: getFeedsForCategory("crypto")
// ------------------------------------------------------------
function getFeedsForCategory(categoryId) {
  if (!categoryId || typeof categoryId !== "string") return [];

  const lower = categoryId.trim().toLowerCase();

  return Object.values(FEEDS).filter(
    (feed) => feed.category.toLowerCase() === lower
  );
}

// ------------------------------------------------------------
// getAllCategories()
// ------------------------------------------------------------
// Returns a sorted array of unique category IDs.
// Example: ["aws", "crypto", "finance", "java", "news", ...]
// ------------------------------------------------------------
function getAllCategories() {
  const categories = new Set();

  for (const feed of Object.values(FEEDS)) {
    if (feed.category) {
      categories.add(feed.category.toLowerCase());
    }
  }

  return Array.from(categories).sort();
}

// ------------------------------------------------------------
// getFeedMetadata(feedId)
// ------------------------------------------------------------
// Returns the feed metadata object or null if not found.
// Example: getFeedMetadata("coindesk")
// ------------------------------------------------------------
function getFeedMetadata(feedId) {
  if (!feedId || typeof feedId !== "string") return null;

  const lower = feedId.trim().toLowerCase();
  return FEEDS[lower] || null;
}

module.exports = {
  getFeedsForCategory,
  getAllCategories,
  getFeedMetadata
};
