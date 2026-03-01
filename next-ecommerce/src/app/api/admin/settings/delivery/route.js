/**
 * Admin API: GET/PUT /api/admin/settings/delivery
 * Manage delivery charges and COD fee
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import DeliverySettings from "@/lib/models/DeliverySettings";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

const DEFAULTS = {
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  codPercentage: 1,
};

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

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
    console.error("Admin delivery settings GET:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const deliveryInsideDhaka = !isNaN(Number(body.deliveryInsideDhaka)) && Number(body.deliveryInsideDhaka) >= 0
      ? Number(body.deliveryInsideDhaka) : DEFAULTS.deliveryInsideDhaka;
    const deliveryOutsideDhaka = !isNaN(Number(body.deliveryOutsideDhaka)) && Number(body.deliveryOutsideDhaka) >= 0
      ? Number(body.deliveryOutsideDhaka) : DEFAULTS.deliveryOutsideDhaka;
    const codPercentage = !isNaN(Number(body.codPercentage))
      ? Math.min(100, Math.max(0, Number(body.codPercentage))) : DEFAULTS.codPercentage;

    if (!USE_MONGODB) {
      return NextResponse.json(
        { error: "Delivery settings require MongoDB. Set MONGODB_URI in your environment." },
        { status: 503 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database connection failed. Check MONGODB_URI." },
        { status: 503 }
      );
    }

    let doc = await DeliverySettings.findOne();
    if (!doc) {
      doc = await DeliverySettings.create(DEFAULTS);
    }
    doc.deliveryInsideDhaka = deliveryInsideDhaka;
    doc.deliveryOutsideDhaka = deliveryOutsideDhaka;
    doc.codPercentage = codPercentage;
    await doc.save();

    return NextResponse.json({
      deliveryInsideDhaka: doc.deliveryInsideDhaka,
      deliveryOutsideDhaka: doc.deliveryOutsideDhaka,
      codPercentage: doc.codPercentage,
    });
  } catch (err) {
    console.error("Admin delivery settings PUT:", err);
    return NextResponse.json({ error: err?.message || "Failed to update settings" }, { status: 500 });
  }
}
