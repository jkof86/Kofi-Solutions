import { jsonResponse } from "../../utils/jsonResponse.js";

export async function handleCoinGeckoCrypto() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/status_updates",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const json = await res.json();
    const updates = json.status_updates || [];

    const items = updates.map(post => ({
      title: `${post.project?.name || "CoinGecko"} — ${post.category}`,
      url: post.project?.homepage || "https://coingecko.com",
      summary: post.description || "",
      content_html: post.description || "",
      date_published: post.created_at,
      image: post.project?.image?.large || null
    }));

    return jsonResponse(200, { status: "ok", items });

  } catch (err) {
    console.error("CoinGecko Crypto error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "CoinGecko Crypto exception: " + err.message,
      items: []
    });
  }
}
