
//Bulletproof Fetch Layer (with fallback proxies)
//Adds caching & Reduces proxy load
export async function fetchWithFallback(url) {
  const encoded = encodeURIComponent(url);

  // Try cache first (5 min TTL)
  const cacheKey = `rss-cache-${encoded}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }

  const attempts = [
    `/proxy?url=${encoded}`,
    `https://corsproxy.io/?${encoded}`,
    `https://api.allorigins.win/raw?url=${encoded}`,
  ];

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt);
      if (!res.ok) continue;

      const text = await res.text();
      if (text && text.length > 0) {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: text })
        );
        return text;
      }
    } catch (err) {
      continue;
    }
  }

  throw new Error("All proxy attempts failed");
}
