// ------------------------------------------------------------
// UserBadgeMedium.jsx — v1.2.0.4
// ------------------------------------------------------------

import { Box, Typography, Chip } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

export default function UserBadgeMedium() {
  const { isLoggedIn, authType, user } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        backgroundColor: "#f0f4ff",
        borderRadius: 2,
        border: "1px solid #c5d8ff"
      }}
    >
      <Chip
        label={authType.toUpperCase()}
        size="small"
        sx={{
          backgroundColor: "#3b78e2",
          color: "#fff",
          fontWeight: 600
        }}
      />

      <Typography sx={{ fontWeight: 600, color: "#1e3c72" }}>
        {user?.email}
      </Typography>
    </Box>
  );
}
