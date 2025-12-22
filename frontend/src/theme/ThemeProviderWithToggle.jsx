// ------------------------------------------------------------
// ThemeProviderWithToggle.jsx
// Wraps app in a light/dark MUI theme with a floating toggle.
// ------------------------------------------------------------

import React, {
  createContext,
  useMemo,
  useState,
  useContext
} from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeProviderWithToggle({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === "light" ? "dark" : "light"));
      }
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function ColorModeToggleButton() {
  const { toggleColorMode } = useColorMode();
  const [mode, setMode] = useState("light");

  const handleClick = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
    toggleColorMode();
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1500 }}
    >
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
