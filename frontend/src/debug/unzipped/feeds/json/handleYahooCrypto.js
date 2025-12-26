// ------------------------------------------------------------
// handleYahooCrypto.js — Yahoo Crypto JSON feed
// ------------------------------------------------------------

const { jsonResponse } = require("../../utils/jsonResponse.js");

async function handleYahooCrypto() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v7/finance/news?category=cryptocurrency",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await res.text();

    // Yahoo sometimes returns HTML on rate limit
    if (text.trim().startsWith("<")) {
      throw new Error("Yahoo returned HTML instead of JSON");
    }

    const json = JSON.parse(text);
    const results = json?.data || [];

    const items = results.map(item => ({
      title: item.title,
      url: item.link || item.url,
      summary: item.summary || "",
      content_html: item.summary || "",
      date_published: item.pubDate || null,
      image:
        item.thumbnail?.resolutions?.[0]?.url ||
        item.main_image_url ||
        null
    }));

    return jsonResponse(200, { status: "ok", items });

  } catch (err) {
    console.error("Yahoo Crypto error:", err);
    return jsonResponse(200, {
      status: "error",
      error: "Yahoo Crypto exception: " + err.message,
      items: []
    });
  }
}

module.exports = { handleYahooCrypto };
