(function () {
    const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js";
    const WORKER = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
    const container = document.getElementById('fundraisingDocument');
    const slides = document.getElementById('fundraisingDocumentSlides');
    const counter = document.getElementById('fundraisingDocumentCounter');
    const prevBtn = document.getElementById('fundraisingDocumentPrev');
    const nextBtn = document.getElementById('fundraisingDocumentNext');

    if (!container) return;

    function updateControls() {
        const pages = slides.querySelectorAll('canvas');
        const firstPage = pages.length
            ? Math.round(container.scrollLeft / (pages[0].getBoundingClientRect().width + 12)) + 1
            : 0;
        const visiblePages = pages.length
            ? Math.max(1, Math.ceil((container.clientWidth + 12) / (pages[0].getBoundingClientRect().width + 12)))
            : 0;

        prevBtn.disabled = container.scrollLeft <= 1;
        nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        counter.textContent = pages.length
            ? 'Pages ' + firstPage + '–' + Math.min(firstPage + visiblePages - 1, pages.length) + ' of ' + pages.length
            : '';
    }

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function renderPage(pdf, pageNumber) {
        const page = await pdf.getPage(pageNumber);
        const canvas = document.createElement('canvas');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.setAttribute('aria-label', 'Fundraising document page ' + pageNumber);
        slides.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
    }

    function scrollPages(direction) {
        const firstPage = slides.querySelector('canvas');
        if (!firstPage) return;
        const gap = parseFloat(window.getComputedStyle(slides).gap) || 0;
        container.scrollBy({
            left: direction * (firstPage.getBoundingClientRect().width + gap),
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', function () {
        scrollPages(-1);
    });
    nextBtn.addEventListener('click', function () {
        scrollPages(1);
    });
    container.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);

    loadScript(PDFJS).then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;
        return window.pdfjsLib.getDocument(container.dataset.pdfUrl).promise;
    }).then(async function (pdf) {
        slides.textContent = '';
        slides.removeAttribute('role');
        for (let i = 1; i <= pdf.numPages; i++) await renderPage(pdf, i);
        updateControls();
    }).catch(function () {
        const link = document.createElement('a');
        link.className = 'learn-more-link';
        link.href = container.dataset.pdfUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Open the PDF';
        slides.textContent = 'Unable to display the fundraising document. ';
        slides.appendChild(link);
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    });
})();
