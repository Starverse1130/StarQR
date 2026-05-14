/**
 * StarQR — qr.js
 * QR Code Generation Logic
 *
 * Handles URL validation, QR generation via qrcode.js,
 * and post-generation UI updates (show QR card, domain label).
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   GENERATE HANDLER
   Main entry point — called when user clicks "Generate QR"
   or presses Enter in the input field.
   ══════════════════════════════════════════════════════════ */

/**
 * Validates the URL, normalizes it, then generates a QR code.
 * Shows loading state during generation for native app feel.
 */
async function handleGenerate() {
  if (state.isLoading) return;

  // Normalize: add https:// if user typed "github.com"
  const rawUrl  = urlInput.value.trim();
  const fullUrl = normalizeUrl(rawUrl);

  // ── Validation ──
  if (!rawUrl) {
    showError('Please enter a URL first');
    urlInput.focus();
    return;
  }

  if (!isValidUrl(fullUrl)) {
    showError('Please enter a valid URL (e.g. github.com)');
    urlInput.focus();
    return;
  }

  // Update input field with the normalized URL
  urlInput.value = fullUrl;
  state.url = fullUrl;

  clearError();
  setLoadingState(true);

  // Short delay for loading feedback (feels like a native app)
  await sleep(180);

  try {
    generateQRCode(fullUrl);
  } catch (err) {
    console.error('QR generation failed:', err);
    showError('QR generation failed. Please try again.');
    setLoadingState(false);
  }
}

/* ══════════════════════════════════════════════════════════
   QR CODE RENDERING
   Uses the qrcode.js library to render a QR code as
   <canvas> + <img> inside the preview card.
   ══════════════════════════════════════════════════════════ */

/**
 * Renders a QR code for the given URL.
 * Dynamically sizes the QR based on screen width to
 * prevent scaling artifacts that break phone scanners.
 *
 * @param {string} url - Validated, normalized URL
 */
function generateQRCode(url) {
  // Clear any previously generated QR
  qrImageWrap.innerHTML = '';

  // Size QR code to match CSS container at each breakpoint
  // This prevents blurry scaling that can break scanners
  let qrSize = 200;
  if (window.innerWidth >= 768) qrSize = 232;      // Tablet+
  else if (window.innerWidth <= 360) qrSize = 170;  // Small phone

  // Generate QR code using qrcode.js library
  new QRCode(qrImageWrap, {
    text:           url,
    width:          qrSize,
    height:         qrSize,
    colorDark:      '#111827',     // Near-black for best scan contrast
    colorLight:     '#ffffff',     // White background
    correctLevel:   QRCode.CorrectLevel.M,  // Medium error correction
  });

  // Brief delay to ensure canvas is rendered before updating UI
  setTimeout(() => {
    setLoadingState(false);
    showQROutput(url);
    state.qrGenerated = true;
  }, 80);
}

/* ══════════════════════════════════════════════════════════
   POST-GENERATION UI
   Updates the card from empty state → QR preview,
   shows action buttons, and scrolls into view.
   ══════════════════════════════════════════════════════════ */

/**
 * Transitions the QR card from empty to filled state.
 * Shows the generated QR, domain label, and action buttons.
 *
 * @param {string} url - The URL that was encoded
 */
function showQROutput(url) {
  // Hide the empty placeholder
  qrEmpty.style.display = 'none';

  // Show the QR output container
  qrOutput.hidden = false;

  // Display the domain below the QR code
  qrDomainText.textContent = extractDomain(url);

  // Upgrade card visual style (enhanced shadow)
  qrCard.classList.add('qr-card--filled');

  // Reveal action buttons with entrance animation
  actionRow.hidden = false;
  actionRow.style.animation = 'sectionEntrance 300ms cubic-bezier(0.16, 1, 0.3, 1) both';

  // Smooth scroll QR into view on mobile (if off-screen)
  setTimeout(() => {
    qrCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}
