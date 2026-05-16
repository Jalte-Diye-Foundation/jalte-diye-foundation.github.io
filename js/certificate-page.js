(async function initCertificatePage() {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id");
    const loadingEl = document.getElementById("certViewLoading");
    const contentEl = document.getElementById("certViewContent");
    const errorEl = document.getElementById("certViewError");
    const paramErrEl = document.getElementById("certParamError");

    function showParamError(msg) {
        loadingEl.hidden = true;
        contentEl.hidden = true;
        errorEl.hidden = true;
        paramErrEl.textContent = msg;
        paramErrEl.hidden = false;
    }

    function showError(html) {
        loadingEl.hidden = true;
        paramErrEl.hidden = true;
        errorEl.hidden = false;
        errorEl.innerHTML = `<div class="cert-error-box">
            <span class="cert-result-bigicon" aria-hidden="true">❌</span>
            <h2>Certificate Not Found</h2>
            <p>${html}</p>
            <a href="verify.html" class="btn-verify-alt">Go to Verify Page</a>
        </div>`;
    }

    if (!rawId || rawId.trim() === "") {
        showParamError("Please enter a Certificate ID. Open the verify page and submit an ID to continue.");
        return;
    }

    const id = rawId.trim().toUpperCase();
    if (!/^JDF-[A-Z0-9]+-CE\d{2,}$/i.test(id)) {
        showParamError("That does not look like a valid Certificate ID. Expected format: JDF-FDC-CE01");
        return;
    }

    const certificates = await loadCertificates();
    if (!certificates) {
        showError("Unable to load certificate data. Please try again later.");
        return;
    }

    const cert = findCertificate(certificates, id);
    if (!cert) {
        showError(`No certificate with ID <strong>${escapeHtml(id)}</strong> was found in our records.`);
        return;
    }

    const displayName = getCertificateRecipientName(cert);
    document.title = `Certificate — ${displayName} — Jalte Diye Foundation`;

    const pdfUrl = getCertificatePdfUrl(cert.id);
    const pdfPreviewUrl = `${pdfUrl}#page=1&view=Fit&zoom=page-fit&toolbar=0&navpanes=0`;
    const pdfFullscreenUrl = `${pdfUrl}#page=1&view=FitH&zoom=page-fit`;
    const linkedinUrl = getLinkedInAddCertificateUrl(cert);
    const recipientLabel = getCertificateRecipientLabel(cert);

    const pdfSection = cert.hasPdf
        ? `<div class="cert-pdf-panel">
            <h3>Certificate Preview</h3>
            <div id="pdfjs-viewer" class="cert-pdf-viewer pdf-container" data-pdf-url="${escapeHtml(pdfUrl)}" style="background:#fff;"></div>
        </div>`
        : "";

    const actionsSection = cert.hasPdf
        ? `<div class="cert-view-actions">
            <a href="${escapeHtml(pdfFullscreenUrl)}" class="btn-view-cert" target="_blank" rel="noopener">Open Fullscreen Preview</a>
            <a href="${escapeHtml(pdfUrl)}" class="btn-view-cert" download>Download PDF</a>
            <a href="${escapeHtml(linkedinUrl)}" class="btn-view-cert" target="_blank" rel="noopener">Add to LinkedIn</a>
            <a href="verify.html" class="btn-verify-alt">Verify Another</a>
           </div>`
        : `<div class="cert-view-actions">
            <p class="cert-no-pdf-note">PDF not yet available. Contact us if you need a copy.</p>
            <a href="${escapeHtml(linkedinUrl)}" class="btn-view-cert" target="_blank" rel="noopener">Add to LinkedIn</a>
            <a href="verify.html" class="btn-verify-alt">Verify Another</a>
           </div>`;

    loadingEl.hidden = true;
    paramErrEl.hidden = true;
    contentEl.hidden = false;
    contentEl.innerHTML = `
        <div class="section-title section-title--tight">
            <hr><span>Certificate of Participation</span><hr>
        </div>
        <div class="cert-view-wrapper${cert.hasPdf ? " cert-view-wrapper--with-pdf" : ""}">
            <div class="cert-meta-panel">
                <div class="cert-valid-badge-large" aria-label="Certificate verified">
                    ✓ Verified Certificate
                </div>
                <div class="cert-details-list">
                    ${row("Certificate ID", `<span class="cert-id-mono">${escapeHtml(cert.id)}</span>`) }
                    ${row(recipientLabel, escapeHtml(displayName))}
                    ${row("Event", escapeHtml(cert.eventName))}
                    ${row("Role", escapeHtml(cert.role))}
                    ${row("Date of Issue", escapeHtml(formatDate(cert.dateOfIssue)))}
                    ${row("Issued By", escapeHtml(cert.issuedBy || "Jalte Diye Foundation"))}
                </div>
                ${actionsSection}
            </div>
            ${pdfSection}
        </div>`;
    // Call PDF.js viewer if PDF is present
    if (cert.hasPdf && window.renderPdfWithPdfjs) {
        const viewer = document.getElementById('pdfjs-viewer');
        if (viewer && viewer.dataset.pdfUrl) {
            window.renderPdfWithPdfjs(viewer.dataset.pdfUrl);
        }
    }
})();

function row(label, value) {
    return `<div class="cert-detail-row">
        <span class="cdl">${label}</span>
        <span class="cdv">${value}</span>
    </div>`;
}
