/**
 * PageContent - Store editable content for About Us & Contact Us (one doc per key)
 * key: "about" | "contact"
 * content: Object (structure per key)
 */

import mongoose from "mongoose";

const pageContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // "about" | "contact"
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const PageContent = mongoose.models.PageContent || mongoose.model("PageContent", pageContentSchema);
export default PageContent;
