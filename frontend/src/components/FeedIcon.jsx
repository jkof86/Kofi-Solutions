import { useState, useEffect } from "react";

export default function FeedIcon({ url, className, size = 96 }) {
  const [svgContent, setSvgContent] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("SVG failed");
        return res.text();
      })
      .then((text) => setSvgContent(text))
      .catch(() => setFailed(true));
  }, [url]);

  if (failed) {
    return (
      <img
        src={require("../images/bg/ksBanner04.jpeg")}
        alt="Fallback"
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          display: "block"
        }}
      />
    );
  }

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
