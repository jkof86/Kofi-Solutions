// ------------------------------------------------------------
// colors.js — Centralized ANSI Color Utilities (No Dependencies)
// ------------------------------------------------------------
//
// Provides:
//   - Foreground colors
//   - Background colors
//   - Bold, underline, dim
//   - Status helpers (success, error, warning, info)
//   - Menu highlight helpers for interactive prompts
//
// All modules import from here to ensure consistent styling.
// ------------------------------------------------------------

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  inverse: "\x1b[7m",

  // Foreground
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Background
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

// Basic color wrapper
function color(text, c) {
  return COLORS[c] + text + COLORS.reset;
}

// cyan color wrapper
function color(text, c) {
  return COLORS[c] + text + COLORS.cyan;
}

// Bold text
function bold(text) {
  return COLORS.bold + text + COLORS.reset;
}

// Dim text
function dim(text) {
  return COLORS.dim + text + COLORS.reset;
}

// Underline text
function underline(text) {
  return COLORS.underline + text + COLORS.reset;
}

// Status helpers
function success(text) {
  return COLORS.green + text + COLORS.reset;
}

function error(text) {
  return COLORS.red + text + COLORS.reset;
}

function warning(text) {
  return COLORS.yellow + text + COLORS.reset;
}

function info(text) {
  return COLORS.cyan + text + COLORS.reset;
}

// ✔ / ❌ / SKIPPED helper
function colorizeStatus(status) {
  if (status === "✔") return success("✔");
  if (status === "❌") return error("❌");
  if (status === "SKIPPED") return warning("SKIPPED");
  return status;
}

// Highlighted menu item (for interactive prompts)
function highlight(text) {
  return COLORS.inverse + COLORS.bold + text + COLORS.reset;
}

// Non-highlighted menu item
function menuItem(text) {
  return COLORS.white + text + COLORS.reset;
}

module.exports = {
  COLORS,
  color,
  bold,
  dim,
  underline,
  success,
  error,
  warning,
  info,
  colorizeStatus,
  highlight,
  menuItem,
};
