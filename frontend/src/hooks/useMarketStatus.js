import { useContext } from "react";
import { MarketStatusContext } from "../context/MarketStatusContext";

export function useMarketStatus() {
  return useContext(MarketStatusContext);
}
