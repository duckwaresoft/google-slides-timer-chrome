/**
 * Minimal Service Worker for Chrome Extension
 *
 * Purpose:
 * - Enables extension lifecycle management
 * - Allows programmatic popup opening for E2E tests via chrome.action.openPopup()
 * - Provides foundation for future background features (keyboard shortcuts, context menus, etc.)
 *
 * Note: This service worker is intentionally minimal. All main functionality
 * happens in content scripts (content.js) that run on Google Slides pages.
 */

// Log when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Slides Timer] Extension installed/updated:', details.reason);
});

// Service worker is now active and ready
console.log('[Slides Timer] Service worker loaded');
