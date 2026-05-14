/**
 * StarQR — actions.js
 * User Action Handlers (Download & Copy)
 *
 * Logic for downloading the generated QR code as an image,
 * and copying the URL to the user's clipboard.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   DOWNLOAD QR
   Extracts the canvas from qrcode.js, converts to a PNG blob,
   and triggers a file download using an anchor tag.
   ══════════════════════════════════════════════════════════ */

/**
 * Handles the "Download" button click.
 * Converts the QR code canvas to a PNG and triggers download.
 */
function handleDownload() {
  if (!state.qrGenerated) return;

  try {
    // Animate download icon for visual feedback
    animateDownloadIcon();

    // qrcode.js renders a <canvas> element inside the wrapper
    const canvas = qrImageWrap.querySelector('canvas');
    if (!canvas) {
      // Fallback: library sometimes converts canvas to <img>
      const img = qrImageWrap.querySelector('img');
      if (img) {
        downloadImage(img.src, generateFilename(state.url));
        return;
      }
      showToast('No QR to download', false);
      return;
    }

    // Convert canvas to a PNG Blob for download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url      = URL.createObjectURL(blob);
      const filename = generateFilename(state.url);
      
      downloadImage(url, filename);
      
      // Cleanup object URL to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');

  } catch (err) {
    console.error('Download failed:', err);
    showToast('Download failed. Try again.', false);
  }
}

/**
 * Triggers a file download using a temporary anchor tag.
 *
 * @param {string} src      - Object URL or Data URI of image
 * @param {string} filename - Desired name for the downloaded file
 */
function downloadImage(src, filename) {
  const link    = document.createElement('a');
  link.href     = src;
  link.download = filename;
  
  // Appending to body is required in Firefox
  link.style.display = 'none';
  document.body.appendChild(link);
  
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
}

/**
 * Plays a bounce animation on the download icon.
 */
function animateDownloadIcon() {
  const icon = downloadBtn.querySelector('i');
  if (!icon) return;
  icon.style.transition = 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  icon.style.transform  = 'translateY(3px)';
  setTimeout(() => { icon.style.transform = 'translateY(0)'; }, 300);
}

/* ══════════════════════════════════════════════════════════
   COPY TO CLIPBOARD
   Copies the generated URL to the clipboard using the
   modern Clipboard API, with a fallback for older browsers.
   ══════════════════════════════════════════════════════════ */

/**
 * Handles the "Copy" button click.
 * Copies the active URL to clipboard and updates UI state.
 */
async function handleCopy() {
  if (!state.qrGenerated || !state.url) return;

  try {
    // Modern Clipboard API
    await navigator.clipboard.writeText(state.url);
    setCopiedState();
    showToast('Copied to clipboard', true);
  } catch {
    // Fallback if Clipboard API fails or is unavailable (e.g. non-HTTPS)
    fallbackCopy(state.url);
    setCopiedState();
    showToast('Copied to clipboard', true);
  }
}

/**
 * Legacy copy method using a hidden textarea and execCommand.
 *
 * @param {string} text - Text to copy
 */
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  
  // Hide off-screen so it doesn't affect layout
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

/**
 * Updates the copy button UI to show a success checkmark.
 * Reverts back to normal after 2 seconds.
 */
function setCopiedState() {
  copyBtn.classList.add('copied');

  // Cancel existing timer if user clicks multiple times
  if (state.copyTimer) clearTimeout(state.copyTimer);

  // Revert UI after 2 seconds
  state.copyTimer = setTimeout(() => {
    copyBtn.classList.remove('copied');
    state.copyTimer = null;
  }, 2000);
}
