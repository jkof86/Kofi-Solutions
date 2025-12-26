import { jsonResponse } from "../../utils/jsonResponse.js";

const CRYPTOPANIC_TOKEN = "YOUR_CRYPTOPANIC_TOKEN";

export async function handleCryptoPanic() {
  try {
    const url =
      `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_TOKEN}&public=true`;

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const json = await res.json();
    const results = json.results || [];

    const items = results.map(post => ({
      title: post.title,
      url: post.url,
      summary: post.domain || "",
      content_html: post.title,
      date_published: post.published_at,
      image: null
    }));

    return jsonResponse(200, { status: "ok", items });

  } catch (err) {
    console.error("CryptoPanic error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "CryptoPanic exception: " + err.message,
      items: []
    });
  }
}
