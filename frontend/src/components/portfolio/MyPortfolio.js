import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Stack, Button, Typography } from "@mui/material";
import pdfFile from "../../misc/jkof_portfolio.PDF";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function MyPortfolio() {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(null);
  const [pageHeight, setPageHeight] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pdfWrapper = useRef(null);

  // Track container width for responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (pdfWrapper.current) {
        const rect = pdfWrapper.current.getBoundingClientRect();
        setWidth(rect.width);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Capture height of first page
  const onPageLoadSuccess = (page) => {
    if (!pageHeight) {
      setPageHeight(page.originalHeight);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: pageHeight ? pageHeight-280 : "100%",
        maxHeight: "100%",
        overflowY: "auto",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      {/*
      // OPTIONAL PAGE NAVIGATION — KEEP COMMENTED OUT

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 1, borderBottom: "1px solid #ddd" }}
      >
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>

        <Typography sx={{ fontSize: 14 }}>
          Page {currentPage} of {numPages || "?"}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          disabled={!numPages || currentPage >= numPages}
          onClick={() =>
            setCurrentPage((p) => (numPages ? Math.min(numPages, p + 1) : p))
          }
        >
          Next
        </Button>
      </Stack>
      */}

      <div ref={pdfWrapper} style={{ width: "100%", overflow: "hidden" }}>
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages || 0), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={index === 0 ? onPageLoadSuccess : undefined}
            />
          ))}
        </Document>
      </div>
    </Box>
  );
}
