// ------------------------------------------------------------
// parseFeed.js — RSS XML → normalized items
// ------------------------------------------------------------

const { stripCdata } = require("../../utils/stripCdata.js");
const { extractImage } = require("../../utils/extractImage.js");

function parseFeed(text, feedKey) {
  const matches = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  const items = matches.map(match => {
    const block = match[1];

    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return stripCdata(m ? m[1] : "");
    };

    const description = get("description");
    const image = extractImage(description);

    return {
      title: get("title"),
      url: get("link"),
      summary: description,
      content_html: description,
      date_published: get("pubDate"),
      image
    };
  });

  return items;
}

module.exports = { parseFeed };
