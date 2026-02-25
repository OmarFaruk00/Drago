/**
 * BlogPost - Admin-managed blog posts
 */

import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    author: { type: String, default: "Drago" },
    category: { type: String, default: "General" },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ published: 1, publishedAt: -1 });

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
