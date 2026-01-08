function extractImage(html = "") {
  if (!html) return null;

  const media = html.match(/<media:content[^>]*url="([^"]+)"/i);
  if (media) return media[1];

  const enclosure = html.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (enclosure) return enclosure[1];

  const img = html.match(/<img[^>]*src="([^"]+)"/i);
  if (img) return img[1];

  return null;
}

module.exports = { extractImage };
