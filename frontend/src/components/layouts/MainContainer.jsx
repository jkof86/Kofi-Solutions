import { Box } from "@mui/material";

const DEFAULT_HEADER_HEIGHT = {
  xs: 56,
  sm: 64,
  md: 72,
};

export default function MainContainer({ children, headerHeight }) {
  return (
    <Box
      sx={{
        pt: headerHeight
          ? `${headerHeight}px`
          : {
              xs: `${DEFAULT_HEADER_HEIGHT.xs}px`,
              sm: `${DEFAULT_HEADER_HEIGHT.sm}px`,
              md: `${DEFAULT_HEADER_HEIGHT.md}px`,
            },
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        transition: "padding-top 0.3s ease",
      }}
    >
      {children}
    </Box>
  );
}
