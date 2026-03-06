/**
 * Mongoose Product Model
 * Ready for MongoDB - uncomment and use when MONGODB_URI is set
 * Run: npm install mongoose
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
      default: null,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // Size variants with individual price & stock (e.g. M=580, XL=620)
    sizeVariants: [
      {
        size: { type: String, trim: true },
        price: { type: Number, min: 0 },
        stock: { type: Number, min: 0, default: 0 },
      },
    ],
    // Color options for product
    colors: [
      {
        name: { type: String, trim: true },
        hex: { type: String, trim: true },
      },
    ],
    // Specification key-value pairs (e.g. { "Display": "6.1 Inch", "RAM": "8GB" })
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Warranty text (e.g. "1 year manufacturer warranty")
    warranty: { type: String, default: "" },
    // Free shipping flag (admin toggle)
    freeShipping: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search (name, description)
productSchema.index({ name: "text", description: "text" });

// Auto-generate slug from name before save (optional)
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Ensure _id is exposed as id for API consistency
productSchema.virtual("id").get(function () {
  return this._id?.toString();
});

productSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Prevent model re-compilation in dev (Next.js hot reload)
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
