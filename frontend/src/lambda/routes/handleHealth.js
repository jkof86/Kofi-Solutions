// ------------------------------------------------------------
// routes/handleHealth.js — Universal health handler
// ------------------------------------------------------------
// - strict=true  (default): failing feeds → "error"
// - strict=false: failing feeds → "fallback"
// ------------------------------------------------------------

import { FEEDS } from "../config/feedsMap.js";
import { jsonResponse } from "../utils/jsonResponse.js";
import { MARKET_FAILURES } from "./handleMarket.js";

export async function handleHealth(qs) {
  const strict = qs.strict === "false" ? false : true; // default strict=true

  const safeCheck = async (key, val) => {
    try {
      if (!val || typeof val !== "string") {
        return [key, strict ? "error" : "fallback"];
      }

      // JSON feeds: we don't ping them here, just mark as "json"
      if (val.startsWith("json:")) {
        return [key, "json"];
      }

      // RSS feeds: try a lightweight HEAD/GET
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(val, {
          method: "GET",
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
          return [key, strict ? "error" : "fallback"];
        }

        return [key, "ok"];
      } catch (err) {
        console.error(`Health fetch failed for ${key}:`, err.message);
        return [key, strict ? "error" : "fallback"];
      }
    } catch (err) {
      console.error(`Health check crashed for ${key}:`, err.message);
      return [key, strict ? "error" : "fallback"];
    }
  };

  const feedEntries = await Promise.all(
    Object.entries(FEEDS).map(([key, val]) => safeCheck(key, val))
  );

  const feeds = {};
  for (const [k, v] of feedEntries) feeds[k] = v;

  const markets = Array.from(MARKET_FAILURES || []);

  return jsonResponse(200, {
    status: "ok",
    feeds,
    markets
  });
}
