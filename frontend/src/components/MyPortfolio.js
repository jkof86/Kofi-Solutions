import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Box } from '@mui/material';
import pdfFile from '../misc/jkof_portfolio.PDF';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

//we have to set up the pdf worker
// const pdfWorker = "node_modules/pdfjs-dist/build/pdf.worker.mjs";
// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function MyPortfolio() {

    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    const pdfWrapper = useRef(null);

    // we use this to dynamically update the pdf width on resize
    useEffect(() => {
        const updateSize = () => {
            if (pdfWrapper.current) {
                setWidth(pdfWrapper.current.getBoundingClientRect().width);
                setHeight(pdfWrapper.current.getBoundingClientRect().height);

            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, []);


    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function previousPage() {
        pageNumber <= 1 ? alert("You're at the beginning of the Document") : setPageNumber(pageNumber - 1);
    }

    function nextPage() {
        pageNumber >= numPages ? alert("You're at the end of the Document") : setPageNumber(pageNumber + 1);
    }


    return (<>
        {/*we add a scroll bar to deal with PDF document overflow*/}
        <div ref={pdfWrapper} style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
            <p>
                Page {pageNumber} of {numPages}
            </p>
            <Box>
                <Button variant='contained' onClick={previousPage}
                    sx={{ margin: ['10px'] }}>
                    previous
                </Button>
                <Button variant='contained' onClick={nextPage}
                    sx={{ margin: ['10px'] }}>
                    Next
                </Button>

                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        height={height}
                    />

                </Document>

                <p>
                Page {pageNumber} of {numPages}
            </p>
            <Box>
                <Button variant='contained' onClick={previousPage}
                    sx={{ margin: ['10px'] }}>
                    previous
                </Button>
                <Button variant='contained' onClick={nextPage}
                    sx={{ margin: ['10px'] }}>
                    Next
                </Button>
                </Box>
            </Box>
            
        </div>
    </>);
}