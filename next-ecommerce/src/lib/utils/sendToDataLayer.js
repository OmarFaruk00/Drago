/**
 * sendToDataLayer - Push events to GTM dataLayer for Meta Pixel / GA4 via GTM
 * Safe for SSR: no-op on server, pushes to window.dataLayer on client
 */

const hasWindow = typeof window !== "undefined";

/**
 * Push event + data to GTM dataLayer
 * @param {string} event - Event name (e.g. 'purchase', 'add_to_cart', 'view_item')
 * @param {object} data - Event payload (will be merged with event key)
 */
export function sendToDataLayer(event, data = {}) {
  if (!hasWindow) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
}
