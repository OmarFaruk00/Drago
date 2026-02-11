import { NextResponse } from "next/server";
import { sendFacebookServerEvent } from "@/lib/tracking/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventName, eventId, customData = {}, userData = {} } = body || {};

    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: "eventName and eventId are required" },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0]?.trim()
      : request.headers.get("x-real-ip");
    const clientUserAgent = request.headers.get("user-agent") || undefined;
    const eventSourceUrl = request.headers.get("referer") || undefined;

    const result = await sendFacebookServerEvent({
      eventName,
      eventId,
      customData,
      userData,
      clientIp,
      clientUserAgent,
      eventSourceUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to forward event", details: result.reason },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tracking route error:", err);
    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}
