/**
 * StarQR — state.js
 * Global State & DOM References
 *
 * This file is loaded FIRST. It grabs references to all
 * HTML elements and creates a central state object that
 * other modules read/write.
 *
 * Why a central state? → Avoids scattered variables,
 * makes it easy to reset everything from one place.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   DOM REFERENCES
   Cached once on load for performance. These constants
   are used by all other JS files (utils, ui, qr, etc.)
   ══════════════════════════════════════════════════════════ */

// ── Input Section ──
const urlInput       = document.getElementById('url-input');
const clearInputBtn  = document.getElementById('clear-input-btn');
const generateBtn    = document.getElementById('generate-btn');
const inputWrapper   = document.getElementById('input-wrapper');
const urlError       = document.getElementById('url-error');
const urlErrorText   = document.getElementById('url-error-text');

// ── QR Preview Section ──
const qrCard         = document.getElementById('qr-card');
const qrEmpty        = document.getElementById('qr-empty');
const qrOutput       = document.getElementById('qr-output');
const qrImageWrap    = document.getElementById('qr-image-wrap');
const qrDomainText   = document.getElementById('qr-domain-text');

// ── Action Buttons ──
const downloadBtn    = document.getElementById('download-btn');
const copyBtn        = document.getElementById('copy-btn');
const clearBtn       = document.getElementById('clear-btn');
const actionRow      = document.getElementById('action-row');

// ── Toast Notification ──
const toast          = document.getElementById('toast');
const toastText      = document.getElementById('toast-text');

/* ══════════════════════════════════════════════════════════
   APPLICATION STATE
   Single source of truth for the app's runtime data.
   All modules read/write from this object.
   ══════════════════════════════════════════════════════════ */
const state = {
  url:          '',       // Current URL entered by user
  qrGenerated:  false,    // Has a QR code been generated?
  isLoading:    false,    // Is the generate button in loading state?
  toastTimer:   null,     // Timer ID for auto-dismissing toast
  copyTimer:    null,     // Timer ID for reverting copy button
};
