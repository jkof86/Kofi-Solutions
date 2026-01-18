// ------------------------------------------------------------
// FeedDebugOverlay.jsx — v1.0 (Floating Debug Toggle)
// ------------------------------------------------------------

import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Drawer,
  Typography,
  Switch,
  FormControlLabel
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";

import { FeedStatusContext } from "../../context/FeedStatusContext";

export default function FeedDebugOverlay() {
  const { status, strictMode, setStrictMode } = useContext(FeedStatusContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Toggle Feed Debug">
        <IconButton
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
            bgcolor: "#fff",
            boxShadow: 2
          }}
          onClick={() => setOpen(true)}
        >
          <BugReportIcon />
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Feed Debug Overlay
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                color="warning"
              />
            }
            label="Strict Mode"
          />

          <Box
            sx={{
              mt: 2,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              maxHeight: 400,
              overflow: "auto",
              bgcolor: "#111",
              color: "#eee",
              p: 1,
              borderRadius: 1
            }}
          >
            <pre>{JSON.stringify(status, null, 2)}</pre>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
