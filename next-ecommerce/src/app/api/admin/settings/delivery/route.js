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
    const deliveryInsideDhaka = Number(body.deliveryInsideDhaka);
    const deliveryOutsideDhaka = Number(body.deliveryOutsideDhaka);
    const codPercentage = Number(body.codPercentage);

    if (!USE_MONGODB) {
      return NextResponse.json({
        deliveryInsideDhaka: !isNaN(deliveryInsideDhaka) ? deliveryInsideDhaka : DEFAULTS.deliveryInsideDhaka,
        deliveryOutsideDhaka: !isNaN(deliveryOutsideDhaka) ? deliveryOutsideDhaka : DEFAULTS.deliveryOutsideDhaka,
        codPercentage: !isNaN(codPercentage) ? Math.min(100, Math.max(0, codPercentage)) : DEFAULTS.codPercentage,
      });
    }

    await connectDB();
    const doc = await DeliverySettings.findOneAndUpdate(
      {},
      {
        deliveryInsideDhaka: !isNaN(deliveryInsideDhaka) && deliveryInsideDhaka >= 0 ? deliveryInsideDhaka : DEFAULTS.deliveryInsideDhaka,
        deliveryOutsideDhaka: !isNaN(deliveryOutsideDhaka) && deliveryOutsideDhaka >= 0 ? deliveryOutsideDhaka : DEFAULTS.deliveryOutsideDhaka,
        codPercentage: !isNaN(codPercentage) ? Math.min(100, Math.max(0, codPercentage)) : DEFAULTS.codPercentage,
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      deliveryInsideDhaka: doc.deliveryInsideDhaka,
      deliveryOutsideDhaka: doc.deliveryOutsideDhaka,
      codPercentage: doc.codPercentage,
    });
  } catch (err) {
    console.error("Admin delivery settings PUT:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
