import { stripCdata } from "../../utils/stripCdata.js";
import { extractImage } from "../../utils/extractImage.js";

export async function parseFeed(text, feedKey) {
  const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => {
    const block = match[1];

    const get = tag => {
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
