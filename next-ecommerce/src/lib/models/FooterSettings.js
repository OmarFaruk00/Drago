/**
 * FooterSettings Model - Admin-managed footer content (single doc)
 */

import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const instagramItemSchema = new mongoose.Schema({
  image: { type: String, default: "" },
  link: { type: String, default: "" },
}, { _id: false });

const helpSupportItemSchema = new mongoose.Schema({
  label: { type: String, default: "" },
  value: { type: String, default: "" },
}, { _id: false });

const footerSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: "" },
    logoSize: { type: String, default: "medium", enum: ["small", "medium", "large"] },
    copyrightText: { type: String, default: "" },
    aboutTitle: { type: String, default: "About Drago" },
    aboutText: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    aboutLinks: [linkSchema],
    accountLinks: [linkSchema],
    policyLinks: [linkSchema],
    socialLinks: [socialLinkSchema],
    helpSupportItems: [helpSupportItemSchema],
    instagramItems: [instagramItemSchema],
  },
  { timestamps: true }
);

// Single document - use a fixed ID
footerSettingsSchema.statics.get = async function () {
  const doc = await this.findOne();
  return doc;
};

footerSettingsSchema.statics.updateSettings = async function (data) {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  Object.assign(doc, data);
  await doc.save();
  return doc;
};

footerSettingsSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const FooterSettings = mongoose.models.FooterSettings || mongoose.model("FooterSettings", footerSettingsSchema);
export default FooterSettings;
