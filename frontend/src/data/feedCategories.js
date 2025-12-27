// ------------------------------------------------------------
// feedCategories.js — v1.170 (Synced + Normalized)
// ------------------------------------------------------------
//
// This file defines the top‑level categories shown in the UI.
// Each category MUST match FEEDS[feedId].category exactly.
//
// Notes:
//   • Order defines tab order.
//   • Icons chosen to match meaning.
//   • "legacy_crypto" intentionally last.
//   • No categories without feeds.
// ------------------------------------------------------------

import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ArchiveIcon from "@mui/icons-material/Archive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";
import SecurityIcon from "@mui/icons-material/Security";
import MemoryIcon from "@mui/icons-material/Memory";
import CloudIcon from "@mui/icons-material/Cloud";
import BoltIcon from "@mui/icons-material/Bolt";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export const FEED_CATEGORIES = [
  // ------------------------------------------------------------
  // Primary categories
  // ------------------------------------------------------------
  { id: "crypto", label: "Crypto", icon: CurrencyBitcoinIcon },
  { id: "finance", label: "Finance", icon: AttachMoneyIcon },
  { id: "news", label: "News", icon: PublicIcon },

  // ------------------------------------------------------------
  // Developer / Technical
  // ------------------------------------------------------------
  { id: "java", label: "Java", icon: CodeIcon },
  { id: "security", label: "Security", icon: SecurityIcon },
  { id: "iot", label: "IoT", icon: MemoryIcon },
  { id: "spring", label: "Spring", icon: BoltIcon },
  { id: "aws", label: "AWS", icon: CloudIcon },
  { id: "react", label: "React", icon: CodeIcon },

  // ------------------------------------------------------------
  // General interest
  // ------------------------------------------------------------
  { id: "sports", label: "Sports", icon: SportsSoccerIcon },

  // ------------------------------------------------------------
  // Legacy / fallback crypto feeds
  // ------------------------------------------------------------
  { id: "legacy_crypto", label: "Legacy Sources", icon: ArchiveIcon }
];
