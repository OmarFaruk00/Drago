/**
 * FlashSaleSettings - Single document: start/end time + product IDs for flash sale
 * When now < start or now > end, flash sale is inactive (section hidden).
 */

import mongoose from "mongoose";

const flashSaleSettingsSchema = new mongoose.Schema(
  {
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    productIds: [{ type: String, trim: true }],
    bannerImage: { type: String, default: "" },
    bannerImageScale: { type: Number, default: 100, min: 50, max: 150 },
  },
  { collection: "flashsalesettings", timestamps: true }
);

const FlashSaleSettings =
  mongoose.models.FlashSaleSettings ||
  mongoose.model("FlashSaleSettings", flashSaleSettingsSchema);

export default FlashSaleSettings;
