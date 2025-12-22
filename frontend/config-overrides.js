// config-overrides.js
module.exports = function override(config) {
  // Remove ALL source-map-loader rules (they break react-is)
  config.module.rules = config.module.rules.filter(
    rule =>
      !(
        rule.enforce === "pre" &&
        rule.use &&
        rule.use.some(u => u.loader && u.loader.includes("source-map-loader"))
      )
  );

  return config;
};
