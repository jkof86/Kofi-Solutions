import React, { useState, useEffect } from "react";

// ------------------------------------------------------------
// In-memory SVG cache (prevents refetching)
// ------------------------------------------------------------
const svgCache = new Map();

// ------------------------------------------------------------
// Timeout helper
// ------------------------------------------------------------
function fetchWithTimeout(url, ms = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    )
  ]);
}

export default function FeedIcon({ url, className = "", size = 96 }) {
  const [svgContent, setSvgContent] = useState(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setFailed(true);
      setLoading(false);
      return;
    }

    // Cached?
    if (svgCache.has(url)) {
      setSvgContent(svgCache.get(url));
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetchWithTimeout(url, 5000)
      .then((res) => {
        if (!res.ok) throw new Error("SVG fetch failed");

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("svg")) {
          throw new Error("Not an SVG");
        }

        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        svgCache.set(url, text);
        setSvgContent(text);
      })
      .catch((err) => {
        console.warn("FeedIcon error:", err.message, "URL:", url);
        if (isMounted) setFailed(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  // ------------------------------------------------------------
  // Loading shimmer
  // ------------------------------------------------------------
  if (loading) {
    return (
      <span
        style={{
          width: size,
          height: size,
          display: "inline-block",
          borderRadius: 8,
          background:
            "linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.2s infinite",
        }}
      />
    );
  }

  // ------------------------------------------------------------
  // Fallback image
  // ------------------------------------------------------------
  if (failed || !svgContent) {
    return (
      <img
        src={require("../../images/bg/ksBanner04.jpeg")}
        alt="Fallback"
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          display: "block",
          borderRadius: 8,
        }}
      />
    );
  }

  // ------------------------------------------------------------
  // Render inline SVG
  // ------------------------------------------------------------
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
