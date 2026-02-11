import crypto from "crypto";

const PIXEL_ID =
  process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.FB_PIXEL_ACCESS_TOKEN || "";

const hashValue = (value) => {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.toString().trim().toLowerCase())
    .digest("hex");
};

const sanitizeUserData = (data = {}) => {
  const hashed = {
    em: hashValue(data.email || data.em),
    ph: hashValue(data.phone || data.ph),
    external_id: hashValue(data.external_id),
    fbc: data.fbc,
    fbp: data.fbp,
  };

  Object.keys(hashed).forEach((key) => {
    if (!hashed[key]) delete hashed[key];
  });

  return hashed;
};

export async function sendFacebookServerEvent({
  eventName,
  eventId,
  customData = {},
  userData = {},
  clientIp,
  clientUserAgent,
  eventSourceUrl,
}) {
  if (!PIXEL_ID || !ACCESS_TOKEN || !eventName) {
    return { success: false, reason: "Missing configuration" };
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          ...sanitizeUserData(userData),
          client_ip_address: clientIp,
          client_user_agent: clientUserAgent,
        },
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Facebook Conversion API error:", error);
      return { success: false, reason: error };
    }

    return { success: true };
  } catch (err) {
    console.error("Facebook Conversion API request failed:", err);
    return { success: false, reason: err.message };
  }
}
