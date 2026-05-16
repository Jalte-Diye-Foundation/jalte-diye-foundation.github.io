// PDF.js loader for NGO-Darpan.html and similar pages
// This script loads PDF.js and renders the PDF inline for maximum compatibility on all devices.
// Usage: Add <div id="pdfjs-viewer"></div> where you want the PDF to appear.
//        Add <script src="js/pdfjs-viewer.js"></script> at the end of the page.

// Use unpkg CDN for PDF.js for compatibility
const PDFJS_CDN = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js";
const PDFJS_WORKER_CDN = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function renderPdfWithPdfjs(pdfUrl, containerId = 'pdfjs-viewer') {
    try {
        await loadScript(PDFJS_CDN);
    } catch (e) {
        const container = document.getElementById(containerId);
        if (container) container.innerText = 'PDF.js failed to load. Please check your connection or try a different browser.';
        return;
    }
    if (!window.pdfjsLib) {
        const container = document.getElementById(containerId);
        if (container) container.innerText = 'PDF.js failed to load. Please check your connection or try a different browser.';
        return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    // Make the container scrollable and set a max height
    container.style.overflowY = 'auto';
    container.style.maxHeight = '80vh';
    container.style.padding = '12px 0';
    // Lower scale for mobile devices for compatibility
    let scale = 3.0;
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(function(pdf) {
        if (!pdf.numPages) {
            container.innerText = 'PDF loaded but contains no pages.';
            return;
        }
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto 16px auto';
                canvas.style.maxWidth = '100%';
                container.appendChild(canvas);
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                page.render({ canvasContext: context, viewport: viewport }).promise.catch(function(err) {
                    canvas.style.display = 'none';
                    const errorMsg = document.createElement('div');
                    errorMsg.style.color = 'red';
                    errorMsg.style.textAlign = 'center';
                    errorMsg.textContent = 'Failed to render PDF page.';
                    container.appendChild(errorMsg);
                });
            }).catch(function(err) {
                const errorMsg = document.createElement('div');
                errorMsg.style.color = 'red';
                errorMsg.style.textAlign = 'center';
                errorMsg.textContent = 'Failed to load PDF page.';
                container.appendChild(errorMsg);
            });
        }
    }, function(reason) {
        container.innerText = 'Failed to load PDF: ' + reason;
    });
}

// Auto-detect and render if #pdfjs-viewer and data-pdf-url are present
window.addEventListener('DOMContentLoaded', function() {
    const viewer = document.getElementById('pdfjs-viewer');
    if (viewer && viewer.dataset.pdfUrl) {
        renderPdfWithPdfjs(viewer.dataset.pdfUrl);
    }
});
