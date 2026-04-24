/**
 * Jalte Diye Foundation — Certificate Utilities
 * Shared functions used by verify.html and certificate.html
 *
 * READ-ONLY CONTRACT
 * ------------------
 * This file only reads certificates/data.json.  It never writes, posts,
 * or mutates any server-side resource.  Returned certificate objects are
 * frozen so callers cannot accidentally modify them in memory.
 *
 * Admin-only helpers (getNextSequence, generateCertificateId) are exposed
 * only when window.CERT_ADMIN_MODE === true, which is set exclusively by
 * admin/index.html on localhost.  They are inert no-ops on public pages.
 *
 * If included from a subdirectory (e.g. admin/), set:
 *   window.CERT_DATA_URL_OVERRIDE = '../certificates/data.json';
 * before including this script.
 */

const CERTIFICATES_DATA_URL = (typeof window !== 'undefined' && window.CERT_DATA_URL_OVERRIDE)
  ? window.CERT_DATA_URL_OVERRIDE
  : 'certificates/data.json';

/**
 * Fetch all certificates from data.json.
 * Returns a frozen array of frozen certificate objects on success,
 * or null on failure.  The fetch is explicitly GET with no credentials
 * and no-store cache to prevent stale or credentialled requests.
 */
async function loadCertificates() {
  try {
    const response = await fetch(CERTIFICATES_DATA_URL, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const certs = Array.isArray(data.certificates) ? data.certificates : [];
    // Freeze each object so callers cannot mutate certificate data in memory
    return Object.freeze(certs.map(c => Object.freeze(Object.assign(Object.create(null), c))));
  } catch (err) {
    console.error('[JDF Certificates] Failed to load data.json:', err);
    return null;
  }
}

/**
 * Find a single certificate by ID (case-insensitive).
 */
function findCertificate(certificates, id) {
  if (!id || !Array.isArray(certificates)) return null;
  const normalised = id.trim().toUpperCase();
  return certificates.find(c => c.id.toUpperCase() === normalised) || null;
}

/**
 * Format an ISO date string (YYYY-MM-DD) to a readable date.
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
}

/** Return the expected PDF URL for a certificate ID. */
function getCertificatePdfUrl(id) {
  return `certificates/pdfs/${id}.pdf`;
}

/** Return the public view URL for a certificate ID. */
function getCertificateViewUrl(id) {
  return `certificate.html?id=${encodeURIComponent(id)}`;
}

/**
 * Return a canonical public base URL.
 * You can override this by setting window.CERT_PUBLIC_BASE_URL.
 */
function getCertificatePublicBaseUrl() {
  if (typeof window !== 'undefined' && window.CERT_PUBLIC_BASE_URL) {
    return window.CERT_PUBLIC_BASE_URL;
  }

  if (typeof window !== 'undefined' && window.location) {
    const { origin, hostname } = window.location;
    if (/^(localhost|127\.0\.0\.1)$/i.test(hostname)) {
      return 'https://jaltediyefoundation.org/';
    }
    return `${origin}/`;
  }

  return 'https://jaltediyefoundation.org/';
}

/** Return the absolute public view URL for a certificate ID. */
function getCertificatePublicUrl(id) {
  const baseUrl = getCertificatePublicBaseUrl();
  return new URL(getCertificateViewUrl(id), baseUrl).href;
}

/** Return the display name for the certificate recipient. */
function getCertificateRecipientName(certificate) {
  if (!certificate || typeof certificate !== 'object') return 'N/A';
  return certificate.speakerName || certificate.volunteerName || certificate.name || 'N/A';
}

/** Return the most suitable label for the certificate recipient field. */
function getCertificateRecipientLabel(certificate) {
  if (!certificate || typeof certificate !== 'object') return 'Name';
  if (certificate.speakerName) return 'Speaker Name';
  if (certificate.volunteerName) return 'Volunteer Name';
  if (certificate.recipientLabel) return certificate.recipientLabel;
  return /speaker/i.test(certificate.role || '') ? 'Speaker Name' : 'Name';
}

/** Return a LinkedIn-friendly certificate title. */
function getLinkedInCertificateName(certificate) {
  if (!certificate || typeof certificate !== 'object') return 'Certificate of Participation';
  return 'Certificate of Participation';
}

/** Return the LinkedIn URL to prefill certificate details. */
function getLinkedInAddCertificateUrl(certificate) {
  if (!certificate || typeof certificate !== 'object') return 'https://www.linkedin.com/profile/add';

  const name = getLinkedInCertificateName(certificate);
  const organizationName = certificate.linkedinOrganizationName || certificate.issuedBy || 'Jalte Diye Foundation';
  const certId = certificate.linkedinCertId || certificate.id || '';
  const certUrl = certificate.linkedinCertUrl || getCertificatePublicUrl(certificate.id || '');

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME'
  });

  if (name) params.set('name', String(name));
  if (organizationName) params.set('organizationName', String(organizationName));
  if (certId) params.set('certId', String(certId));
  if (certUrl) params.set('certUrl', String(certUrl));

  const issueYearFromData = Number(certificate.linkedinIssueYear);
  const issueMonthFromData = Number(certificate.linkedinIssueMonth);
  if (!Number.isNaN(issueYearFromData) && issueYearFromData > 0) {
    params.set('issueYear', String(issueYearFromData));
  }
  if (!Number.isNaN(issueMonthFromData) && issueMonthFromData >= 1 && issueMonthFromData <= 12) {
    params.set('issueMonth', String(issueMonthFromData));
  }

  if (!params.has('issueYear') && !params.has('issueMonth') && certificate.dateOfIssue) {
    const issuedOn = new Date(`${certificate.dateOfIssue}T00:00:00`);
    if (!Number.isNaN(issuedOn.getTime())) {
      params.set('issueYear', String(issuedOn.getFullYear()));
      params.set('issueMonth', String(issuedOn.getMonth() + 1));
    }
  }

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

/**
 * Compute the next sequence number for a given event code.
 * Returns zero-padded string, e.g. "01", "02", "10".
 *
 * ADMIN-ONLY — returns null on public pages.
 */
function getNextSequence(certificates, eventCode) {
  if (typeof window === 'undefined' || !window.CERT_ADMIN_MODE) return null;
  const prefix = `JDF-${eventCode.toUpperCase()}-CE`;
  const existing = (Array.isArray(certificates) ? certificates : [])
    .filter(c => c.id.toUpperCase().startsWith(prefix.toUpperCase()))
    .map(c => parseInt(c.id.slice(prefix.length), 10))
    .filter(n => !isNaN(n));
  const max = existing.length > 0 ? Math.max(...existing) : 0;
  return String(max + 1).padStart(2, '0');
}

/** Generate a new certificate ID based on existing data.
 *
 * ADMIN-ONLY — returns null on public pages.
 */
function generateCertificateId(certificates, eventCode) {
  if (typeof window === 'undefined' || !window.CERT_ADMIN_MODE) return null;
  const seq = getNextSequence(certificates, eventCode);
  return `JDF-${eventCode.toUpperCase()}-CE${seq}`;
}

/**
 * Helper: escape text safely for insertion into HTML strings.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(text ?? '')));
  return div.innerHTML;
}
