const form = document.getElementById("verifyForm");
const resultDiv = document.getElementById("certResult");
const formErrDiv = document.getElementById("certFormError");

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const preId = params.get("id");
    if (preId) {
        document.getElementById("certId").value = preId.toUpperCase();
        form.dispatchEvent(new Event("submit"));
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formErrDiv.hidden = true;

    const raw = document.getElementById("certId").value.trim().toUpperCase();
    if (!raw) {
        formErrDiv.textContent = "Please enter a Certificate ID.";
        formErrDiv.hidden = false;
        return;
    }

    if (!/^JDF-[A-Z0-9]+-CE\d{2,}$/i.test(raw)) {
        formErrDiv.textContent = "That does not look like a valid Certificate ID. Expected format: JDF-FDC-CE01";
        formErrDiv.hidden = false;
        return;
    }

    resultDiv.hidden = false;
    resultDiv.innerHTML = '<div class="cert-result-loading" role="status">Verifying&hellip;</div>';

    const certificates = await loadCertificates();

    if (certificates === null) {
        resultDiv.innerHTML = renderError(
            "⚠️",
            "Connection Error",
            "Unable to reach the certificate database. Please check your internet connection and try again."
        );
        return;
    }

    const cert = findCertificate(certificates, raw);

    if (!cert) {
        resultDiv.innerHTML = renderInvalid(raw);
        return;
    }

    resultDiv.innerHTML = renderValid(cert);
});

function renderError(icon, title, msg) {
    return `<div class="cert-result-box cert-result-error">
        <span class="cert-result-bigicon" aria-hidden="true">${icon}</span>
        <h3>${title}</h3>
        <p>${msg}</p>
    </div>`;
}

function renderInvalid(id) {
    return `<div class="cert-result-box cert-result-invalid">
        <span class="cert-result-bigicon" aria-hidden="true">❌</span>
        <h3>Certificate Not Found</h3>
        <p>No certificate matching <strong>${escapeHtml(id)}</strong> was found in our records.</p>
        <p>Please double-check the ID or <a href="mailto:contact@jaltediyefoundation.org">contact us</a> if you believe this is an error.</p>
    </div>`;
}

function renderValid(cert) {
    const displayName = getCertificateRecipientName(cert);
    const viewLink = cert.hasPdf
        ? `<div class="cert-result-actions">
            <a href="${getCertificateViewUrl(cert.id)}" class="btn-view-cert">View &amp; Download Certificate</a>
           </div>`
        : "";

    return `<div class="cert-result-box cert-result-valid">
        <div class="cert-valid-header">
            <span class="cert-valid-badge" aria-label="Certificate verified">✓ Verified</span>
            <h3>Certificate Authenticated</h3>
            <p class="cert-valid-subtitle">This certificate was officially issued by Jalte Diye Foundation.</p>
        </div>
        <div class="cert-details-grid">
            ${detailItem("Certificate ID", `<span class="cert-id-mono">${escapeHtml(cert.id)}</span>`) }
            ${detailItem("Name", escapeHtml(displayName))}
            ${detailItem("Event", escapeHtml(cert.eventName))}
            ${detailItem("Role", escapeHtml(cert.role))}
            ${detailItem("Date of Issue", escapeHtml(formatDate(cert.dateOfIssue)))}
            ${detailItem("Issued By", escapeHtml(cert.issuedBy || "Jalte Diye Foundation"))}
        </div>
        ${viewLink}
    </div>`;
}

function detailItem(label, value) {
    return `<div class="cert-detail-item">
        <span class="cert-detail-label">${label}</span>
        <span class="cert-detail-value">${value}</span>
    </div>`;
}
