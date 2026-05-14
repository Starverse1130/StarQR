/**
 * StarQR — utils.js
 * Pure Utility Functions
 *
 * Helper functions with no side effects — they take input
 * and return output without touching the DOM or state.
 * Can be tested independently.
 */

'use strict';

/**
 * Prepends 'https://' to a URL if no protocol is present.
 * Allows users to type "github.com" without the protocol.
 *
 * @param {string} url - Raw URL string from user input
 * @returns {string} URL with protocol guaranteed
 *
 * @example
 *   normalizeUrl('github.com')        → 'https://github.com'
 *   normalizeUrl('https://google.com') → 'https://google.com'
 *   normalizeUrl('')                   → ''
 */
function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url) && url.length > 0) {
    return 'https://' + url;
  }
  return url;
}

/**
 * Validates whether a string is a proper HTTP/HTTPS URL.
 * Uses the native URL constructor for reliable parsing.
 *
 * @param {string} url - URL to validate (should include protocol)
 * @returns {boolean} true if valid HTTP(S) URL
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts the domain name from a URL, stripping "www.".
 * Falls back to the raw string if parsing fails.
 *
 * @param {string} url - Full URL
 * @returns {string} Clean domain (e.g., "github.com")
 */
function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Generates a clean filename for downloading the QR PNG.
 * Format: "starqr-{domain}.png" (max 24 chars for domain).
 *
 * @param {string} url - The URL the QR was generated for
 * @returns {string} Safe filename (e.g., "starqr-github.com.png")
 */
function generateFilename(url) {
  try {
    const domain = extractDomain(url);
    const clean  = domain.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 24);
    return `starqr-${clean}.png`;
  } catch {
    // Fallback: use date if domain extraction fails
    const date = new Date().toISOString().slice(0, 10);
    return `starqr-${date}.png`;
  }
}

/**
 * Promise-based delay — pauses execution for given ms.
 * Used to add perceived loading feedback (feels native).
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
