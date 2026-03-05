/**
 * Banner Model - Admin-managed homepage/slider banners
 */

import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, default: "" },
    linkText: { type: String, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    /** Where to show: "hero" = hero slider, "after_top_products" = after Top Products, "promo" = promo area */
    section: { type: String, default: "hero", trim: true },
  },
  { timestamps: true }
);

bannerSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
