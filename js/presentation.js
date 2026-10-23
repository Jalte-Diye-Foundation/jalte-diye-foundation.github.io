// Slide-by-slide PDF presenter with full-screen support (PDF.js).
(function () {
    const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js";
    const WORKER = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

    const deck = document.getElementById('deck');
    const stage = document.getElementById('deck-stage');
    const canvas = document.getElementById('deck-canvas');
    const status = document.getElementById('deck-status');
    const counter = document.getElementById('deck-counter');
    const prevBtn = document.getElementById('deck-prev');
    const nextBtn = document.getElementById('deck-next');
    const presentBtn = document.getElementById('deck-present');

    let pdf = null;
    let current = 1;
    let rendering = false;
    let pending = null;
    let hideTimer = null;

    function fail(msg) {
        status.hidden = false;
        status.textContent = msg;
    }

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            const s = document.createElement('script');
            s.src = url;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function render(num) {
        if (rendering) { pending = num; return; }
        rendering = true;
        try {
            const page = await pdf.getPage(num);
            const base = page.getViewport({ scale: 1 });
            const box = stage.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const fit = Math.min(box.width / base.width, box.height / base.height);
            const viewport = page.getViewport({ scale: Math.max(fit, 0.1) * dpr });
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = Math.floor(viewport.width / dpr) + 'px';
            canvas.style.height = Math.floor(viewport.height / dpr) + 'px';
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
            canvas.hidden = false;
            status.hidden = true;
        } catch (e) {
            fail('Failed to render slide.');
        }
        rendering = false;
        if (pending !== null) {
            const n = pending;
            pending = null;
            if (n === current) render(n);
        }
    }

    function go(num) {
        if (!pdf) return;
        current = Math.min(Math.max(num, 1), pdf.numPages);
        counter.textContent = current + ' / ' + pdf.numPages;
        prevBtn.disabled = current === 1;
        nextBtn.disabled = current === pdf.numPages;
        render(current);
    }

    function isFullscreen() {
        return document.fullscreenElement === deck || document.webkitFullscreenElement === deck;
    }

    function togglePresent() {
        if (isFullscreen()) {
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        } else {
            const req = deck.requestFullscreen || deck.webkitRequestFullscreen;
            if (req) req.call(deck);
            else window.open(deck.dataset.pdfUrl, '_blank', 'noopener');
        }
    }

    function showControls() {
        deck.classList.add('show-controls');
        deck.classList.remove('hide-cursor');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            deck.classList.remove('show-controls');
            deck.classList.add('hide-cursor');
        }, 2500);
    }

    function onFullscreenChange() {
        presentBtn.textContent = isFullscreen() ? 'Exit Full Screen' : 'Present Full Screen';
        if (isFullscreen()) showControls();
        else {
            clearTimeout(hideTimer);
            deck.classList.remove('show-controls', 'hide-cursor');
        }
        // Wait for layout to settle before re-fitting the slide.
        setTimeout(function () { go(current); }, 100);
    }

    prevBtn.addEventListener('click', function () { go(current - 1); });
    nextBtn.addEventListener('click', function () { go(current + 1); });
    presentBtn.addEventListener('click', togglePresent);
    stage.addEventListener('click', function (e) {
        const rect = stage.getBoundingClientRect();
        go(e.clientX - rect.left < rect.width * 0.25 ? current - 1 : current + 1);
    });
    deck.addEventListener('mousemove', function () { if (isFullscreen()) showControls(); });
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('resize', function () { go(current); });

    document.addEventListener('keydown', function (e) {
        if (!pdf || e.ctrlKey || e.metaKey || e.altKey) return;
        switch (e.key) {
            case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
                if (e.target.closest && e.target.closest('button, a')) {
                    if (e.key === ' ' || e.key === 'Enter') return;
                }
                e.preventDefault(); go(current + 1); break;
            case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
                e.preventDefault(); go(current - 1); break;
            case 'Home': e.preventDefault(); go(1); break;
            case 'End': e.preventDefault(); go(pdf.numPages); break;
            case 'f': case 'F': togglePresent(); break;
        }
    });

    loadScript(PDFJS).then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;
        return window.pdfjsLib.getDocument(deck.dataset.pdfUrl).promise;
    }).then(function (doc) {
        pdf = doc;
        presentBtn.disabled = false;
        go(1);
    }).catch(function () {
        fail('Could not load the presentation. Please download the PDF instead.');
    });
})();
