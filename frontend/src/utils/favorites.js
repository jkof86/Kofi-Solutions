// ------------------------------------------------------------
// favorites.js
// LocalStorage-based favorites management.
// ------------------------------------------------------------

const KEY = "rss_favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(feedName) {
  const favs = getFavorites();
  const exists = favs.includes(feedName);

  const updated = exists
    ? favs.filter(f => f !== feedName)
    : [...favs, feedName];

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(feedName) {
  return getFavorites().includes(feedName);
}
  