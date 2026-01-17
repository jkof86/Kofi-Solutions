import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box } from "@mui/material";
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
  const pdfWrapper = useRef(null);

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

  return (
    
      <Box
        ref={pdfWrapper}
        sx={{
          flexGrow: 1,
          height: "100%",
          maxHeight: 790,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
        }}
      >
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages || 0), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </Box>
  );
}
