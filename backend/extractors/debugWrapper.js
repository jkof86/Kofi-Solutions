/**
 * debugWrapper.js — Wraps extractors with detailed logging
 * ------------------------------------------------------------
 * Logs:
 *   ✓ extractor start/end
 *   ✓ domain + URL
 *   ✓ HTML length
 *   ✓ returned metadata
 *   ✓ errors thrown inside extractor
 *   ✓ execution time
 */

module.exports = function wrapExtractor(extractor, domain) {
  return async function wrappedExtractor(html, url) {
    const start = Date.now();

    console.log("[extractor][START]", { domain, url });

    if (!html || typeof html !== "string") {
      console.warn("[extractor][NO_HTML]", { domain, url });
    } else {
      console.log("[extractor][HTML_LENGTH]", {
        domain,
        url,
        length: html.length
      });
    }

    try {
      const meta = await extractor(html, url);

      const duration = Date.now() - start;

      console.log("[extractor][RESULT]", {
        domain,
        url,
        duration,
        meta
      });

      return meta;
    } catch (err) {
      const duration = Date.now() - start;

      console.error("[extractor][ERROR]", {
        domain,
        url,
        duration,
        error: err.message,
        stack: err.stack
      });

      // Prevent infinite loops by returning a safe empty object
      return {
        image: null,
        description: null,
        author: null,
        published: null,
        tags: []
      };
    }
  };
};
