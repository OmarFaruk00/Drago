/**
 * Admin Model - for admin authentication
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["super_admin", "manager"],
      default: "manager",
    },
    timezone: { type: String, default: "GMT+06:00" },
    language: { type: String, default: "en" },
    notificationPreferences: {
      newOrder: { type: Boolean, default: true },
      customerSignup: { type: Boolean, default: true },
      stockAlert: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: false },
      newMessages: { type: Boolean, default: true },
      promotionOffers: { type: Boolean, default: false },
      securityBilling: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
