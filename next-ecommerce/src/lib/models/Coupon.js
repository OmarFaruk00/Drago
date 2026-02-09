/**
 * Coupon Model for discount codes
 */

import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ["fixed", "percentage", "free_shipping", "price_discount"],
      default: "fixed",
    },
    discountValue: { type: Number, required: true, min: 0 },
    discountUnit: { type: String, enum: ["percent", "amount"], default: "amount" },
    description: { type: String, default: "" },
    totalUsageLimit: { type: Number, default: null },
    usagePerCustomer: { type: Number, default: null },
    usageCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

couponSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.startDate) return "scheduled";
  if (now > this.endDate) return "expired";
  return "active";
});

couponSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
