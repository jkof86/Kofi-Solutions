import React, { useContext } from "react";
import { FeedStatusContext } from "../../context/FeedStatusContext";
import { API_BASE } from "../../data/api";

export default function DebugBanner() {
  const { apiStage } = useContext(FeedStatusContext);

  const bannerStyle = {
    padding: "6px 12px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: apiStage === "test" ? "#f57c00" : "#2e7d32",
    borderRadius: "4px",
    display: "inline-block",
    marginBottom: "8px"
  };

  return (
    <div style={bannerStyle}>
      Stage: {apiStage.toUpperCase()} — {API_BASE}
    </div>
  );
}
