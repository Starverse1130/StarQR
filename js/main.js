/**
 * StarQR — main.js
 * Initialization & Event Binding
 *
 * This file is loaded LAST. It waits for the DOM, binds
 * all event listeners to their respective handlers, and
 * focuses the input to make the app ready to use instantly.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   INITIALIZATION
   Called when the DOM is fully loaded.
   ══════════════════════════════════════════════════════════ */

/**
 * Bootstraps the application.
 */
function init() {
  // Auto-focus input on load for immediate typing (desktop mainly)
  // Wrapped in requestAnimationFrame to ensure rendering is complete
  requestAnimationFrame(() => {
    urlInput.focus();
  });

  // Bind all user interactions to functions
  bindEvents();
}

/* ══════════════════════════════════════════════════════════
   EVENT BINDING
   Hooks up buttons and inputs to logic in other files.
   ══════════════════════════════════════════════════════════ */

/**
 * Attaches all event listeners.
 */
function bindEvents() {
  // URL input field events
  urlInput.addEventListener('input',   onUrlInput);
  urlInput.addEventListener('blur',    onUrlBlur);
  urlInput.addEventListener('keydown', onUrlKeydown);

  // Clear input (the × button inside the text field)
  clearInputBtn.addEventListener('click', clearInputOnly);

  // Generate QR button
  generateBtn.addEventListener('click', handleGenerate);

  // Action row buttons (shown after QR is generated)
  downloadBtn.addEventListener('click', handleDownload);
  copyBtn.addEventListener('click',     handleCopy);
  clearBtn.addEventListener('click',    handleClear);
}

/* ══════════════════════════════════════════════════════════
   URL INPUT HANDLERS
   Logic for handling typing, blurring, and keyboard events.
   ══════════════════════════════════════════════════════════ */

/**
 * Triggered on every keystroke in the URL input.
 * Shows/hides the clear button and removes error styling.
 */
function onUrlInput() {
  const value = urlInput.value.trim();
  state.url = value;

  // Toggle the × clear button visibility
  if (value.length > 0) {
    clearInputBtn.hidden = false;
    clearInputBtn.style.opacity = '1';
    clearInputBtn.style.pointerEvents = 'auto';
  } else {
    clearInputBtn.hidden = true;
  }

  // If user starts typing again, assume they are fixing the error
  if (inputWrapper.classList.contains('input-wrapper--error')) {
    clearError();
  }
}

/**
 * Triggered when the URL input loses focus.
 * Auto-normalizes the URL (e.g. adding https://).
 */
function onUrlBlur() {
  const value = urlInput.value.trim();
  if (value) {
    urlInput.value = normalizeUrl(value);
    state.url = urlInput.value;
  }
}

/**
 * Triggered on keyboard events within the input.
 * Handles "Enter" for submit and "Escape" to clear focus.
 *
 * @param {KeyboardEvent} e - The keyboard event object
 */
function onUrlKeydown(e) {
  // Enter key → Generate QR code (if not already loading)
  if (e.key === 'Enter' && !state.isLoading) {
    e.preventDefault(); // Prevent accidental form submission behavior
    handleGenerate();
  }
  
  // Escape key → Drop focus (useful for keyboard navigation)
  if (e.key === 'Escape') {
    urlInput.blur();
  }
}

/* ══════════════════════════════════════════════════════════
   BOOTSTRAP ENTRY POINT
   Ensures init() only runs after DOM is ready.
   ══════════════════════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
