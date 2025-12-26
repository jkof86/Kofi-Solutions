import { safeRssFetch } from "./safeRssFetch.js";
import { jsonResponse } from "../../utils/jsonResponse.js";

export async function handleRss(url, feedKey) {
  const result = await safeRssFetch(url, feedKey);

  return jsonResponse(200, {
    status: result.ok ? "ok" : "error",
    items: result.items
  });
}
