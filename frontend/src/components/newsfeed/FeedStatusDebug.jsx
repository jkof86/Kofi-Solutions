// ------------------------------------------------------------
// FeedStatusDebug.jsx — v1.0 (Raw Backend Health Viewer)
// ------------------------------------------------------------

import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function FeedStatusDebug() {
  const { health } = useContext(FeedStatusContext);
  const [open, setOpen] = useState(false);

  if (!health) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#555", flexGrow: 1 }}
        >
          Raw Feed Health (Debug)
        </Typography>

        <IconButton size="small" onClick={() => setOpen((v) => !v)}>
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: 2,
            maxHeight: 260,
            overflow: "auto",
            bgcolor: "#111",
            color: "#eee",
            fontFamily: "monospace",
            fontSize: "0.75rem"
          }}
        >
          <pre style={{ margin: 0 }}>
            {JSON.stringify(health, null, 2)}
          </pre>
        </Paper>
      </Collapse>
    </Box>
  );
}
