/**
 * HomeSections - Which product IDs show in "Top Products" and "Explore Our Products" on home page
 * Single document; admin can set topProductIds and exploreProductIds (ordered arrays).
 */

import mongoose from "mongoose";

const homeSectionsSchema = new mongoose.Schema(
  {
    topProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    exploreProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    exploreCount: { type: Number, default: 12 },
  },
  { timestamps: true }
);

homeSectionsSchema.statics.get = async function () {
  const doc = await this.findOne();
  return doc;
};

const HomeSections = mongoose.models.HomeSections || mongoose.model("HomeSections", homeSectionsSchema);
export default HomeSections;
