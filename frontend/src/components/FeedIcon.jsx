import React, { useEffect, useState } from "react";

export default function FeedIcon({ url, className, size = 96 }) {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(null));
  }, [url]);

  if (!svgContent) return null;

  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block"
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
