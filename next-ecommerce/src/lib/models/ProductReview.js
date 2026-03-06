/**
 * ProductReview - User reviews for products (text + images + rating)
 */

import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, trim: true, default: "" },
    userAvatar: { type: String, trim: true, default: "" },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    images: [{ type: String, trim: true }],
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

productReviewSchema.index({ productId: 1, createdAt: -1 });

productReviewSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProductReview =
  mongoose.models.ProductReview || mongoose.model("ProductReview", productReviewSchema);
export default ProductReview;
