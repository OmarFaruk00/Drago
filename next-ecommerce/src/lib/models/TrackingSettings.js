/**
 * TrackingSettings Model - Admin-managed GTM ID, Meta Pixel ID, etc.
 * Single document store for analytics/tracking config
 */

import mongoose from "mongoose";

const trackingSettingsSchema = new mongoose.Schema(
  {
    gtmId: { type: String, default: "", trim: true },
    fbPixelId: { type: String, default: "", trim: true },
  },
  { collection: "trackingsettings", timestamps: true }
);

trackingSettingsSchema.statics.get = async function () {
  const doc = await this.findOne().lean();
  return doc;
};

trackingSettingsSchema.statics.updateSettings = async function (data) {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  if (data.gtmId !== undefined) doc.gtmId = String(data.gtmId).trim();
  if (data.fbPixelId !== undefined) doc.fbPixelId = String(data.fbPixelId).trim();
  await doc.save();
  return doc;
};

const TrackingSettings =
  mongoose.models.TrackingSettings ||
  mongoose.model("TrackingSettings", trackingSettingsSchema);

export default TrackingSettings;
