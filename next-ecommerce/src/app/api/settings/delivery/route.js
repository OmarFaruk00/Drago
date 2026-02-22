/**
 * Public API: GET /api/settings/delivery
 * Returns delivery charges and COD fee % for checkout (no auth required)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import DeliverySettings from "@/lib/models/DeliverySettings";
import { USE_MONGODB } from "@/lib/config";

const DEFAULTS = {
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  codPercentage: 1,
};

export async function GET() {
  try {
    if (!USE_MONGODB) {
      return NextResponse.json(DEFAULTS);
    }
    await connectDB();
    const doc = await DeliverySettings.findOne().lean();
    if (!doc) {
      return NextResponse.json(DEFAULTS);
    }
    return NextResponse.json({
      deliveryInsideDhaka: doc.deliveryInsideDhaka ?? DEFAULTS.deliveryInsideDhaka,
      deliveryOutsideDhaka: doc.deliveryOutsideDhaka ?? DEFAULTS.deliveryOutsideDhaka,
      codPercentage: doc.codPercentage ?? DEFAULTS.codPercentage,
    });
  } catch (err) {
    console.error("Delivery settings GET:", err);
    return NextResponse.json(DEFAULTS);
  }
}
