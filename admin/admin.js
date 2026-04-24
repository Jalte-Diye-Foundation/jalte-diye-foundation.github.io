const ADMIN_PASSWORD_HASH = "ce21fb3579fdea81784289cc867e5beb43cc77569359ee3561d26c472a9d6b1d";

let allCertificates = [];
let editingCertificateId = null;

async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(() => {
            btn.textContent = orig;
            btn.classList.remove("copied");
        }, 2000);
    }).catch(() => {
        showToast("Copy failed. Please copy manually.");
    });
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", () => {
    if (ADMIN_PASSWORD_HASH === null) {
        document.getElementById("setupPanel").style.display = "";
        document.getElementById("loginPanel").hidden = true;
    } else {
        document.getElementById("setupPanel").style.display = "none";
        document.getElementById("loginPanel").hidden = false;
    }

    document.getElementById("btnSetup").addEventListener("click", async function () {
        const pw = document.getElementById("setupPw").value;
        const pw2 = document.getElementById("setupPwConfirm").value;
        const err = document.getElementById("setupError");
        err.hidden = true;

        if (!pw || pw.length < 8) {
            err.textContent = "Password must be at least 8 characters.";
            err.hidden = false;
            return;
        }
        if (pw !== pw2) {
            err.textContent = "Passwords do not match.";
            err.hidden = false;
            return;
        }

        const hash = await sha256(pw);
        document.getElementById("setupHashDisplay").textContent = hash;
        document.getElementById("setupHashResult").hidden = false;

        document.getElementById("btnCopySetupHash").addEventListener("click", function () {
            copyText(hash, this);
        });
    });

    document.getElementById("loginPw").addEventListener("keydown", function (e) {
        if (e.key === "Enter") document.getElementById("btnLogin").click();
    });

    document.getElementById("btnLogin").addEventListener("click", async function () {
        const pw = document.getElementById("loginPw").value;
        const err = document.getElementById("loginError");
        err.hidden = true;

        if (!pw) {
            err.textContent = "Please enter your password.";
            err.hidden = false;
            return;
        }

        const hash = await sha256(pw);
        if (hash !== ADMIN_PASSWORD_HASH) {
            err.textContent = "Incorrect password. Please try again.";
            err.hidden = false;
            document.getElementById("loginPw").value = "";
            return;
        }

        sessionStorage.setItem("jdf_admin_auth", "1");
        document.getElementById("authScreen").hidden = true;
        document.getElementById("adminPanel").hidden = false;
        initialiseAdmin();
    });
});

async function initialiseAdmin() {
    const certs = await loadCertificates();
    allCertificates = certs || [];
    renderDashboard();
    renderTable(allCertificates);
    setDefaultDate();

    document.querySelectorAll(".sidebar-nav-btn[data-tab]").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".sidebar-nav-btn").forEach((b) => b.classList.remove("active"));
            document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
            document.getElementById(this.dataset.tab).classList.add("active");
        });
    });

    document.getElementById("btnLogout").addEventListener("click", () => {
        sessionStorage.removeItem("jdf_admin_auth");
        location.reload();
    });

    document.getElementById("certSearch").addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        const filtered = allCertificates.filter((c) =>
            c.id.toLowerCase().includes(q) ||
            c.volunteerName.toLowerCase().includes(q) ||
            (c.eventName || "").toLowerCase().includes(q)
        );
        renderTable(filtered);
    });

    document.getElementById("btnExportJson").addEventListener("click", () => {
        const json = JSON.stringify({ certificates: allCertificates }, null, 2);
        downloadFile("data.json", json);
    });

    document.getElementById("fEventCode").addEventListener("input", function () {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    });

    document.getElementById("addCertForm").addEventListener("submit", handleAddCert);
    document.getElementById("btnResetForm").addEventListener("click", resetAddForm);

    document.getElementById("btnGenNewHash").addEventListener("click", async function () {
        const pw = document.getElementById("newPw").value;
        const pw2 = document.getElementById("newPwConfirm").value;
        const err = document.getElementById("changePwError");
        err.hidden = true;

        if (!pw || pw.length < 8) {
            err.textContent = "Password must be at least 8 characters.";
            err.hidden = false;
            return;
        }
        if (pw !== pw2) {
            err.textContent = "Passwords do not match.";
            err.hidden = false;
            return;
        }

        const hash = await sha256(pw);
        document.getElementById("newHashDisplay").textContent = hash;
        document.getElementById("newHashResult").hidden = false;
        document.getElementById("btnCopyNewHash").onclick = function () {
            copyText(hash, this);
        };
    });
}

function renderDashboard() {
    const certs = allCertificates;
    const withPdf = certs.filter((c) => c.hasPdf).length;
    const events = new Set(certs.map((c) => c.eventCode || c.eventName)).size;
    document.getElementById("statTotal").textContent = certs.length;
    document.getElementById("statWithPdf").textContent = withPdf;
    document.getElementById("statNoPdf").textContent = certs.length - withPdf;
    document.getElementById("statEvents").textContent = events;
}

function renderTable(certs) {
    const tbody = document.getElementById("certTableBody");
    const heading = document.getElementById("listHeading");
    heading.textContent = `Certificates (${certs.length})`;

    if (!certs.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">No certificates found.</td></tr>';
        return;
    }

    tbody.innerHTML = certs.map((c) => `
        <tr>
            <td><span class="tbl-id">${escapeHtml(c.id)}</span></td>
            <td>${escapeHtml(c.volunteerName)}</td>
            <td>${escapeHtml(c.eventName)}</td>
            <td>${escapeHtml(c.role)}</td>
            <td>${escapeHtml(formatDate(c.dateOfIssue))}</td>
            <td>${c.hasPdf ? '<span class="tbl-pdf-yes">Yes</span>' : '<span class="tbl-pdf-no">No</span>'}</td>
            <td>
                <div class="tbl-actions">
                    <button class="btn-tbl btn-tbl-edit" onclick="startEditCert('${encodeURIComponent(c.id)}')">Edit</button>
                    <button class="btn-tbl btn-tbl-view" onclick="window.open('../certificate.html?id=${encodeURIComponent(c.id)}','_blank')">View</button>
                    <button class="btn-tbl btn-tbl-del" onclick="removeCert('${escapeHtml(c.id)}')">Remove</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function startEditCert(encodedId) {
    const id = decodeURIComponent(encodedId);
    const cert = allCertificates.find((c) => c.id === id);
    if (!cert) {
        showToast("Certificate not found in current list.");
        return;
    }

    editingCertificateId = id;
    document.getElementById("fVolunteerName").value = cert.volunteerName || "";
    document.getElementById("fEventCode").value = cert.eventCode || "";
    document.getElementById("fEventName").value = cert.eventName || "";
    document.getElementById("fRole").value = cert.role || "";
    document.getElementById("fDateOfIssue").value = cert.dateOfIssue || "";
    document.getElementById("fIssuedBy").value = cert.issuedBy || "Jalte Diye Foundation";
    document.getElementById("fHasPdf").value = cert.hasPdf ? "true" : "false";

    document.getElementById("fEventCode").disabled = true;
    document.getElementById("btnSubmitCert").textContent = "Save Certificate Changes";
    document.getElementById("btnResetForm").textContent = "Reset Fields";
    document.getElementById("btnCancelEdit").hidden = false;
    document.getElementById("editModeId").textContent = id;
    document.getElementById("editModeBanner").hidden = false;
    document.getElementById("genOutput").hidden = true;
    document.getElementById("addFormError").hidden = true;

    const addTabBtn = document.querySelector('.sidebar-nav-btn[data-tab="tab-add"]');
    if (addTabBtn) addTabBtn.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearEditMode() {
    editingCertificateId = null;
    document.getElementById("fEventCode").disabled = false;
    document.getElementById("btnSubmitCert").textContent = "Generate Certificate Entry";
    document.getElementById("btnResetForm").textContent = "Clear";
    document.getElementById("btnCancelEdit").hidden = true;
    document.getElementById("editModeBanner").hidden = true;
}

function removeCert(id) {
    if (!confirm(`Remove certificate ${id}?\n\nThis generates an updated data.json without this entry. You will need to download and commit it.`)) return;
    allCertificates = allCertificates.filter((c) => c.id !== id);
    renderDashboard();
    renderTable(allCertificates);
    const json = JSON.stringify({ certificates: allCertificates }, null, 2);
    downloadFile("data.json", json);
    showToast(`${id} removed. Commit the downloaded data.json to apply changes.`);
}

function setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("fDateOfIssue").value = today;
}

function handleAddCert(e) {
    e.preventDefault();

    const errDiv = document.getElementById("addFormError");
    errDiv.hidden = true;

    const name = document.getElementById("fVolunteerName").value.trim();
    const eventCode = document.getElementById("fEventCode").value.trim().toUpperCase();
    const eventName = document.getElementById("fEventName").value.trim();
    const role = document.getElementById("fRole").value.trim();
    const dateIssue = document.getElementById("fDateOfIssue").value;
    const issuedBy = document.getElementById("fIssuedBy").value.trim() || "Jalte Diye Foundation";
    const hasPdf = document.getElementById("fHasPdf").value === "true";

    if (!name || !eventCode || !eventName || !role || !dateIssue) {
        errDiv.textContent = "Please fill in all required fields.";
        errDiv.hidden = false;
        return;
    }

    if (!/^[A-Z0-9]+$/.test(eventCode)) {
        errDiv.textContent = "Event Code may only contain letters and numbers.";
        errDiv.hidden = false;
        return;
    }

    if (editingCertificateId) {
        const editedId = editingCertificateId;
        const idx = allCertificates.findIndex((c) => c.id === editingCertificateId);
        if (idx === -1) {
            errDiv.textContent = "The certificate you are editing was not found. Please try again.";
            errDiv.hidden = false;
            return;
        }

        allCertificates[idx] = {
            ...allCertificates[idx],
            volunteerName: name,
            eventName: eventName,
            role: role,
            dateOfIssue: dateIssue,
            hasPdf: hasPdf,
            issuedBy: issuedBy
        };

        renderDashboard();
        renderTable(allCertificates);

        const updatedJson = JSON.stringify({ certificates: allCertificates }, null, 2);
        downloadFile("data.json", updatedJson);
        showToast(`Certificate ${editedId} updated. Commit the downloaded data.json.`);
        resetAddForm();
        return;
    }

    const newId = generateCertificateId(allCertificates, eventCode);

    const newEntry = {
        id: newId,
        volunteerName: name,
        eventName: eventName,
        eventCode: eventCode,
        role: role,
        dateOfIssue: dateIssue,
        hasPdf: hasPdf,
        issuedBy: issuedBy
    };

    allCertificates.push(newEntry);
    renderDashboard();

    const jsonStr = JSON.stringify(newEntry, null, 2);
    document.getElementById("genId").textContent = newId;
    document.getElementById("genJson").textContent = jsonStr;
    document.getElementById("genPdfFilename").textContent = `${newId}.pdf`;
    document.getElementById("genOutput").hidden = false;

    document.getElementById("btnCopyJson").onclick = function () {
        copyText(jsonStr, this);
    };

    document.getElementById("btnDlUpdated").onclick = function () {
        const updatedJson = JSON.stringify({ certificates: allCertificates }, null, 2);
        downloadFile("data.json", updatedJson);
        showToast("data.json downloaded. Commit it to GitHub to publish.");
    };

    showToast(`Certificate ${newId} ready. Download data.json to publish.`);
    document.getElementById("genOutput").scrollIntoView({ behavior: "smooth" });
}

function resetAddForm() {
    document.getElementById("addCertForm").reset();
    document.getElementById("addFormError").hidden = true;
    document.getElementById("genOutput").hidden = true;
    clearEditMode();
    setDefaultDate();
}

document.getElementById("btnCancelEdit").addEventListener("click", () => {
    resetAddForm();
    showToast("Edit mode cancelled.");
});
