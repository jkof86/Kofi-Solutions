// ------------------------------------------------------------
// rssParser.js — Robust RSS/JSON feed parser
// ------------------------------------------------------------
//
// Exports:
//   • fetchRssFeed(url): Promise<items[]>
//
// Each item:
//   { title, url, date, source, description }
//
// On failure, throws an Error (caller decides fallback).
// ------------------------------------------------------------

const Parser = require("rss-parser");

// Node 18+ has global fetch — no import needed
// const fetch = require("node-fetch");

const parser = new Parser();

function normalizeItem(raw, sourceLabel) {
  return {
    title: raw.title || "Untitled",
    url: raw.link || raw.guid || "#",
    date: raw.isoDate || raw.pubDate || null,
    source: sourceLabel,
    description: raw.contentSnippet || raw.content || ""
  };
}

async function fetchRssFeed(url, sourceLabel = "") {
  if (!url) throw new Error("Missing RSS URL");

  // Try RSS first
  try {
    const feed = await parser.parseURL(url);
    const items = (feed.items || []).map((item) =>
      normalizeItem(item, sourceLabel || feed.title || "")
    );
    return items;
  } catch (err) {
    // As a fallback, try JSON if the endpoint is JSON-based
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json.items)) {
        return json.items.map((item) =>
          normalizeItem(item, sourceLabel || json.title || "")
        );
      }

      throw new Error("Unsupported JSON structure");
    } catch (jsonErr) {
      throw new Error(
        `RSS/JSON parse failed: ${String(err)} | JSON fallback: ${String(
          jsonErr
        )}`
      );
    }
  }
}

module.exports = { fetchRssFeed };
