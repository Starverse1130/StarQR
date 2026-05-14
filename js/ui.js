/**
 * StarQR — ui.js
 * UI State Management
 *
 * Functions that update the visual state of UI components:
 * loading spinner, error messages, reset/clear, and toast
 * notifications. No business logic — pure DOM manipulation.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   LOADING STATE
   Toggles the generate button between normal and loading.
   ══════════════════════════════════════════════════════════ */

/**
 * Sets the generate button to loading or normal state.
 * When loading: shows spinner, disables button, changes text.
 *
 * @param {boolean} loading - true = loading, false = normal
 */
function setLoadingState(loading) {
  state.isLoading = loading;

  if (loading) {
    generateBtn.classList.add('btn--loading');
    generateBtn.disabled = true;
    generateBtn.querySelector('.btn__text').textContent = 'Generating...';
  } else {
    generateBtn.classList.remove('btn--loading');
    generateBtn.disabled = false;
    generateBtn.querySelector('.btn__text').textContent = 'Generate QR';
  }
}

/* ══════════════════════════════════════════════════════════
   CLEAR / RESET
   Functions for clearing input and resetting the entire
   app back to its initial state.
   ══════════════════════════════════════════════════════════ */

/**
 * Handles the "Clear" action button.
 * Plays a collapse animation on the QR card, then resets.
 */
function handleClear() {
  if (!state.qrGenerated) return;

  // Animate QR card collapse before clearing
  qrCard.classList.add('qr-card--collapse');

  setTimeout(() => {
    resetAll();
    qrCard.classList.remove('qr-card--collapse');
  }, 220);
}

/**
 * Clears only the URL input field (the × button inside input).
 * Does NOT clear the generated QR code.
 */
function clearInputOnly() {
  urlInput.value        = '';
  state.url             = '';
  clearInputBtn.hidden  = true;
  clearError();
  urlInput.focus();
}

/**
 * Full app reset — clears input, QR code, action buttons,
 * errors, and copy state. Returns app to initial state.
 */
function resetAll() {
  // Clear input
  urlInput.value        = '';
  state.url             = '';
  state.qrGenerated     = false;
  clearInputBtn.hidden  = true;

  // Reset QR card to empty state
  qrCard.classList.remove('qr-card--filled', 'qr-card--collapse');
  qrOutput.hidden = true;
  qrImageWrap.innerHTML = '';
  qrDomainText.textContent = '';

  // Show empty state again with fade-in
  qrEmpty.style.display = '';
  qrEmpty.style.animation = 'fadeIn 220ms ease-out both';

  // Hide action buttons
  actionRow.hidden = true;

  // Clear any error state
  clearError();

  // Reset copy button visual state
  copyBtn.classList.remove('copied');
  if (state.copyTimer) {
    clearTimeout(state.copyTimer);
    state.copyTimer = null;
  }

  // Return focus to input for quick re-use
  urlInput.focus();
}

/* ══════════════════════════════════════════════════════════
   ERROR HANDLING
   Shows/hides inline error messages below the URL input.
   ══════════════════════════════════════════════════════════ */

/**
 * Displays an error message below the URL input.
 * Triggers a shake animation for visual feedback.
 *
 * @param {string} message - Error text to display
 */
function showError(message) {
  urlErrorText.textContent = message;
  urlError.hidden = false;
  inputWrapper.classList.add('input-wrapper--error');

  // Re-trigger shake animation by resetting it
  urlError.style.animation = 'none';
  void urlError.offsetWidth; // Force browser reflow
  urlError.style.animation = 'errorShake 300ms ease-in-out';
}

/**
 * Hides the error message and removes error styling.
 */
function clearError() {
  urlError.hidden = true;
  inputWrapper.classList.remove('input-wrapper--error');
}

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   Shows a temporary message at the bottom of the screen.
   Auto-dismisses after 1.5 seconds.
   ══════════════════════════════════════════════════════════ */

/**
 * Shows a toast notification with a message.
 * Supports success (green) and error (red) variants.
 *
 * @param {string}  message   - Text to display in the toast
 * @param {boolean} isSuccess - true = green icon, false = red icon
 */
function showToast(message, isSuccess = true) {
  // Cancel any existing toast timer
  if (state.toastTimer) {
    clearTimeout(state.toastTimer);
    state.toastTimer = null;
  }

  toastText.textContent = message;

  // Update the icon color based on success/error
  const icon = toast.querySelector('i');
  if (icon) {
    icon.style.color = isSuccess ? 'var(--success)' : 'var(--error)';
  }

  // Show toast with entrance animation
  toast.hidden = false;
  toast.classList.remove('toast--hiding');

  // Force reflow before adding visible class (CSS trick)
  void toast.offsetWidth;
  toast.classList.add('toast--visible');

  // Auto-dismiss after 1.5 seconds
  state.toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.classList.add('toast--hiding');

    // Remove from DOM after exit animation completes
    setTimeout(() => {
      toast.hidden = true;
      toast.classList.remove('toast--hiding');
      state.toastTimer = null;
    }, 180);
  }, 1500);
}
