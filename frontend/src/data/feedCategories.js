// ------------------------------------------------------------
// feedCategories.js — v1.177
// ------------------------------------------------------------
//
// Notes:
//   • Order defines the UI tab order in TabsLayout
//   • Must match FEEDS categories exactly
//   • "infowars" stays last and disabled by default
//
// ------------------------------------------------------------

export const FEED_CATEGORIES = [
  { id: "crypto", label: "Crypto" },
  { id: "finance", label: "Finance" },
  { id: "news", label: "News" },
  { id: "java", label: "Java" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "iot", label: "IoT" },
  { id: "spring", label: "Spring" },
  { id: "aws", label: "AWS" },
  { id: "react", label: "React" },
  { id: "sports", label: "Sports" },

  // Scaffolded category — feed disabled
  { id: "infowars", label: "Infowars" }
];
