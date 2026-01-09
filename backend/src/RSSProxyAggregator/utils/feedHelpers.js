// ------------------------------------------------------------
// feedsHelpers.js — v1.200 (Hardened + Normalized + Safe)
// ------------------------------------------------------------
//
// Purpose:
//   Provide safe, AWS‑friendly utilities for working with FEEDS.
//   These helpers are used across the backend (handleFeed,
//   handleHealth, category routing, etc.)
//
// Exports:
//   • getFeedsForCategory(categoryId)
//   • getAllCategories()
//   • getFeedMetadata(feedId)
//
// Improvements in v1.200:
//   ✓ Hardened against malformed FEEDS entries
//   ✓ Normalizes category + feedId lookups
//   ✓ Safe fallback behavior (never throws)
//   ✓ Fully compatible with handleFeed.js v1.208
//   ✓ Pure functions — no mutation, no side effects
//
// ------------------------------------------------------------

const { FEEDS } = require("./feedsMap.js");

// ------------------------------------------------------------
// normalizeKey(str)
// ------------------------------------------------------------
// Ensures consistent lowercase lookup for feed IDs + categories.
// ------------------------------------------------------------
function normalizeKey(str) {
  return String(str || "").trim().toLowerCase();
}

// ------------------------------------------------------------
// getFeedsForCategory(categoryId)
// ------------------------------------------------------------
// Returns an array of feed objects belonging to the category.
// Example: getFeedsForCategory("crypto")
// ------------------------------------------------------------
function getFeedsForCategory(categoryId) {
  if (!categoryId || typeof categoryId !== "string") return [];

  const target = normalizeKey(categoryId);

  return Object.values(FEEDS).filter((feed) => {
    const cat = normalizeKey(feed?.category);
    return cat === target;
  });
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
    const cat = normalizeKey(feed?.category);
    if (cat) categories.add(cat);
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

  const key = normalizeKey(feedId);
  return FEEDS[key] || null;
}

module.exports = {
  getFeedsForCategory,
  getAllCategories,
  getFeedMetadata
};
