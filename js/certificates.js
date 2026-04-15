/**
 * Jalte Diye Foundation — Certificate Utilities
 * Shared functions used by verify.html and certificate.html
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
 * Returns the array on success, or null on failure.
 */
async function loadCertificates() {
  try {
    const response = await fetch(CERTIFICATES_DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.certificates) ? data.certificates : [];
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
 * Compute the next sequence number for a given event code.
 * Returns zero-padded string, e.g. "01", "02", "10".
 */
function getNextSequence(certificates, eventCode) {
  const prefix = `JDF-${eventCode.toUpperCase()}-CE`;
  const existing = (Array.isArray(certificates) ? certificates : [])
    .filter(c => c.id.toUpperCase().startsWith(prefix.toUpperCase()))
    .map(c => parseInt(c.id.slice(prefix.length), 10))
    .filter(n => !isNaN(n));
  const max = existing.length > 0 ? Math.max(...existing) : 0;
  return String(max + 1).padStart(2, '0');
}

/** Generate a new certificate ID based on existing data. */
function generateCertificateId(certificates, eventCode) {
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
