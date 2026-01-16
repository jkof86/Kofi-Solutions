import React, { useContext, useState, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Paper
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FeedStatusContext } from "../../context/FeedStatusContext";
import { API_BASE } from "../../data/api";

export default function DebugTab() {
  const { apiStage } = useContext(FeedStatusContext);

  const [debugOutput, setDebugOutput] = useState("");
  const [customQuery, setCustomQuery] = useState("?debug=echo&msg=hello");
  const debugRef = useRef(null);

  // ------------------------------------------------------------
  // Backend runner
  // ------------------------------------------------------------
  const runDebug = async (queryString) => {
    try {
      const url = `${API_BASE}${queryString}`;
      const res = await fetch(url);
      const json = await res.json();
      setDebugOutput(JSON.stringify(json, null, 2));

      // Auto-scroll to bottom
      setTimeout(() => {
        if (debugRef.current) {
          debugRef.current.scrollTop = debugRef.current.scrollHeight;
        }
      }, 50);
    } catch (err) {
      setDebugOutput(`Error: ${err.message}`);
    }
  };

  // ------------------------------------------------------------
  // Copy to clipboard
  // ------------------------------------------------------------
  const copyDebug = () => {
    if (!debugOutput) return;
    navigator.clipboard.writeText(debugOutput);
  };

  return (
    <Box sx={{ mt: 2 }}>

      {/* Preset Debug Buttons */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        API Debug
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        <Chip
          label="Ping"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?debug=ping"); }}
          clickable
        />
        <Chip
          label="Echo"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?debug=echo"); }}
          clickable
        />
        <Chip
          label="Env"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?debug=env"); }}
          clickable
        />
        <Chip
          label="Feeds"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?debug=feeds"); }}
          clickable
        />
        <Chip
          label="Market"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?mode=market_all"); }}
          clickable
        />
        <Chip
          label="Health"
          color="info"
          onClick={() => { setDebugOutput(""); runDebug("?mode=health"); }}
          clickable
        />

        <Chip
          label="Clear"
          color="warning"
          onClick={() => setDebugOutput("")}
          clickable
        />
      </Stack>

      {/* Custom Query Runner */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Custom Query (e.g. ?mode=market&symbol=btc)"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => { setDebugOutput(""); runDebug(customQuery); }}
          disabled={!customQuery.trim()}
        >
          Run
        </Button>
      </Stack>

      {/* Debug Output Panel */}
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ flex: 1 }}>
          Debug Output
        </Typography>
        <Tooltip title="Copy to clipboard">
          <span>
            <IconButton
              size="small"
              onClick={copyDebug}
              disabled={!debugOutput}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: "#111",
          color: "#0f0",
          borderRadius: 1,
          height: "260px",
          overflowY: "auto",
          fontSize: "0.8rem",
          fontFamily: "monospace"
        }}
        ref={debugRef}
      >
        {debugOutput || "Debug output will appear here…"}
      </Paper>
    </Box>
  );
}
