import { Box, Typography, Chip, Paper, Button } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserHeader from "../layouts/UserHeader";

const cardLabels = ["Profile", "Settings", "Activity", "Support"];

export default function GuestUser() {
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState("Profile");

  return (
    <Box sx={{ p: 4 }}>

      <UserHeader />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#1976d2",
          color: "#fff",
          px: 3,
          py: 2,
          borderRadius: 2,
          boxShadow: 3,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Guest User Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Chip
          label={`v1.2.0.4 • ${user?.email || "Unknown Guest User"}`}
          sx={{
            backgroundColor: "#fff",
            color: "#1976d2",
            fontWeight: 600
          }}
        />
      </Box>

      {/* Two-column layout */}
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* LEFT COLUMN — Cards */}
        <Box sx={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 2 }}>
          {cardLabels.map((label) => (
            <Paper
              key={label}
              elevation={activeCard === label ? 6 : 2}
              sx={{
                p: 2,
                cursor: "pointer",
                backgroundColor: activeCard === label ? "#e3f2fd" : "#fff",
                border: activeCard === label ? "2px solid #1976d2" : "1px solid #ccc",
                transition: "0.2s ease",
              }}
              onClick={() => setActiveCard(label)}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* RIGHT COLUMN — Dynamic Content */}
        <Box
          sx={{
            flex: "1 1 auto",
            minHeight: 240,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {activeCard} Panel
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            This is a placeholder for {activeCard.toLowerCase()}‑specific content.
          </Typography>

          <Button variant="outlined" sx={{ mt: 3 }}>
            Action for {activeCard}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
