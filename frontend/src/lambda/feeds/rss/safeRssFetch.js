import { parseFeed } from "./parseFeed.js";
import { buildFallbackCard } from "../../utils/fallback.js";

export async function safeRssFetch(url, feedKey) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8"
      }
    });

    const text = await res.text();

    if (text.trim().startsWith("<!DOCTYPE html") || text.includes("<html")) {
      throw new Error("HTML returned instead of RSS");
    }

    const items = await parseFeed(text, feedKey);
    return { ok: true, items };

  } catch (err) {
    console.error(`RSS error for ${feedKey}:`, err.message);
    return {
      ok: false,
      items: [buildFallbackCard(feedKey)]
    };
  }
} 
