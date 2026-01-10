// ------------------------------------------------------------
// GuestUser.jsx — v1.2.0.3
// ------------------------------------------------------------
//
// Placeholder page for future guest‑specific dashboards.
// Guest accounts are temporary and non‑persistent.
//
// ------------------------------------------------------------

import { Box, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

export default function GuestUser() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Guest User
      </Typography>

      <Typography variant="body1">
        Logged in as: {user?.email || "Guest"}
      </Typography>

      <Typography sx={{ mt: 2, opacity: 0.7 }}>
        This page is a placeholder for future guest‑specific features.
      </Typography>
    </Box>
  );
}
