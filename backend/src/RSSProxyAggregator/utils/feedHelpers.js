// utils/feedHelpers.js (CommonJS)

const { normalizeItem } = require("./normalize.js");

function minimalFallback(baseUrl) {
  return [
    normalizeItem(
      {
        title: "No articles available",
        link: baseUrl || "",
        description: null
      },
      { sourceType: "minimal" }
    )
  ];
}

module.exports = { minimalFallback };
