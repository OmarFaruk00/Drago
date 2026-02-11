"use client";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

const hasWindow = typeof window !== "undefined";

const generateEventId = () => {
  if (hasWindow && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  try {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
};

const sendServerEvent = async ({
  eventName,
  eventId,
  customData = {},
  userData = {},
}) => {
  if (!PIXEL_ID) return;
  try {
    await fetch("/api/tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        customData,
        userData,
      }),
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Tracking event failed", err);
    }
  }
};

const triggerFbq = (method, eventName, data = {}, options = {}) => {
  if (!hasWindow || !window.fbq || !PIXEL_ID) return;
  window.fbq(method, eventName, data, { eventID: options.eventId });
};

const trackStandardEvent = (eventName, customData = {}, userData = {}) => {
  if (!PIXEL_ID) return null;
  const eventId = generateEventId();
  triggerFbq("track", eventName, customData, { eventId });
  sendServerEvent({ eventName, eventId, customData, userData });
  return eventId;
};

export const trackPageView = (customData = {}) =>
  trackStandardEvent("PageView", customData);

export const trackLead = (customData = {}) =>
  trackStandardEvent("Lead", customData);

export const trackPurchase = (customData = {}) =>
  trackStandardEvent("Purchase", customData);

export const trackContact = (customData = {}) =>
  trackStandardEvent("Contact", customData);

export const trackAddToCart = (customData = {}) =>
  trackStandardEvent("AddToCart", customData);

export { generateEventId };
