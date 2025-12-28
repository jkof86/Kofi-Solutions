function buildFallbackCard(feedKey) {
  return {
    title: `Feed Unavailable — ${feedKey}`,
    url: "",
    summary: `The feed "${feedKey}" is currently unavailable.`,
    content_html: `<p>The feed "${feedKey}" is currently unavailable.</p>`,
    date_published: new Date().toISOString(),
    image: null
  };
}

module.exports = { buildFallbackCard };
