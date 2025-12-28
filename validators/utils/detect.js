// ------------------------------------------------------------
// detect.js — Content-Type & Body Heuristics for Feeds
// ------------------------------------------------------------
//
// Responsibilities:
//   - Classify responses as:
//       * rss_xml
//       * atom_xml
//       * json
//       * html
//       * unknown
//   - Detect likely Cloudflare / WAF / paywall blocks
//   - Provide a compact "kind" + "reason" descriptor
//
// Inputs:
//   - statusCode: number | null
//   - contentType: string | null
//   - body: string | null
//
// Outputs:
//   - {
//       kind: "rss_xml" | "atom_xml" | "json" | "html" | "unknown",
//       blocked: boolean,
//       reason: string | null
//     }
// ------------------------------------------------------------

function detectContentKind({ statusCode, contentType, body }) {
  const lowerType = (contentType || "").toLowerCase();
  const snippet = (body || "").slice(0, 2048).toLowerCase(); // small sample

  // If status is clearly an error, mark as unknown with reason
  if (statusCode && statusCode >= 400) {
    return {
      kind: "unknown",
      blocked: false,
      reason: `HTTP_${statusCode}`,
    };
  }

  // Content-Type based detection
  if (lowerType.includes("application/rss+xml") || looksLikeRss(snippet)) {
    return {
      kind: "rss_xml",
      blocked: false,
      reason: "RSS_XML",
    };
  }

  if (lowerType.includes("application/atom+xml") || looksLikeAtom(snippet)) {
    return {
      kind: "atom_xml",
      blocked: false,
      reason: "ATOM_XML",
    };
  }

  if (
    lowerType.includes("application/json") ||
    lowerType.includes("application/feed+json") ||
    looksLikeJson(snippet)
  ) {
    return {
      kind: "json",
      blocked: false,
      reason: "JSON",
    };
  }

  if (
    lowerType.includes("text/html") ||
    looksLikeHtml(snippet)
  ) {
    const blockedInfo = detectBlocks(snippet);
    return {
      kind: "html",
      blocked: blockedInfo.blocked,
      reason: blockedInfo.reason,
    };
  }

  // Fallback: unknown
  return {
    kind: "unknown",
    blocked: false,
    reason: null,
  };
}

// ------------------------------------------------------------
// Heuristics
// ------------------------------------------------------------

function looksLikeRss(snippet) {
  return (
    snippet.includes("<rss") ||
    snippet.includes("<rdf:rdf") ||
    snippet.includes("<channel>") ||
    snippet.includes("<item>")
  );
}

function looksLikeAtom(snippet) {
  return (
    snippet.includes("<feed") &&
    snippet.includes("xmlns=\"http://www.w3.org/2005/Atom\"")
  );
}

function looksLikeJson(snippet) {
  const trimmed = snippet.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

function looksLikeHtml(snippet) {
  return (
    snippet.includes("<!doctype html") ||
    snippet.includes("<html") ||
    snippet.includes("<head") ||
    snippet.includes("<body")
  );
}

function detectBlocks(snippet) {
  // Cloudflare / WAF / Captcha / Paywall patterns
  if (snippet.includes("cloudflare") && snippet.includes("attention required")) {
    return { blocked: true, reason: "CLOUDFLARE_BLOCK" };
  }

  if (snippet.includes("access denied") || snippet.includes("request blocked")) {
    return { blocked: true, reason: "ACCESS_DENIED" };
  }

  if (snippet.includes("captcha") && snippet.includes("verify you are human")) {
    return { blocked: true, reason: "CAPTCHA" };
  }

  if (
    snippet.includes("subscription") &&
    (snippet.includes("subscribe") || snippet.includes("sign in"))
  ) {
    return { blocked: true, reason: "PAYWALL" };
  }

  return { blocked: false, reason: "HTML_PAGE" };
}

module.exports = {
  detectContentKind,
};
