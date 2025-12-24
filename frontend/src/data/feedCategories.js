// ------------------------------------------------------------
// feedCategories.js — Frontend category metadata
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
  { id: "crypto", label: "Crypto", icon: CurrencyBitcoinIcon },
  { id: "finance", label: "Finance", icon: AttachMoneyIcon },
  { id: "news", label: "News", icon: PublicIcon },
  { id: "java", label: "Java", icon: CodeIcon },
  { id: "security", label: "Security", icon: SecurityIcon },
  { id: "iot", label: "IoT", icon: MemoryIcon },
  { id: "spring", label: "Spring", icon: BoltIcon },
  { id: "aws", label: "AWS", icon: CloudIcon },
  { id: "react", label: "React", icon: CodeIcon },
  { id: "sports", label: "Sports", icon: SportsSoccerIcon },
  { id: "legacy_crypto", label: "Legacy Sources", icon: ArchiveIcon }

];
