/**
 * DeliverySettings Model - Separate MongoDB collection for delivery & COD fees
 * Single document store (upsert by key)
 */

import mongoose from "mongoose";

const deliverySettingsSchema = new mongoose.Schema(
  {
    deliveryInsideDhaka: { type: Number, default: 60, min: 0 },
    deliveryOutsideDhaka: { type: Number, default: 120, min: 0 },
    codPercentage: { type: Number, default: 1, min: 0, max: 100 },
  },
  { collection: "deliverysettings", timestamps: true }
);

const DeliverySettings =
  mongoose.models.DeliverySettings ||
  mongoose.model("DeliverySettings", deliverySettingsSchema);

export default DeliverySettings;
