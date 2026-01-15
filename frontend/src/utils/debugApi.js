// ------------------------------------------------------------
// debugApi.js — Centralized Debug Request Helper
// ------------------------------------------------------------
//
// Purpose:
//   • Allows UI components to trigger backend debug endpoints
//   • Alerts raw JSON responses for quick inspection
//   • Prevents duplication of fetch logic
//
// ------------------------------------------------------------

import { API_BASE } from "../data/api";


export async function debugRequest(path) {
  try {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url);
    const json = await res.json();
    alert(JSON.stringify(json, null, 2));
  } catch (err) {
    alert("ERROR:\n" + String(err));
  }
}
