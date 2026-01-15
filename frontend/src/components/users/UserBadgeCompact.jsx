// ------------------------------------------------------------
// UserBadgeCompact.jsx — v1.2.0.4
// ------------------------------------------------------------

import { Chip } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

export default function UserBadgeCompact() {
  const { isLoggedIn, authType, user } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <Chip
      label={`${authType.toUpperCase()} • ${user?.email || ""}`}
      sx={{
        backgroundColor: "#e3f2fd",
        color: "#0d47a1",
        fontWeight: 600,
        borderRadius: "16px",
        px: 1.5,
        py: 0.5,
        fontSize: "0.8rem"
      }}
    />
  );
}
