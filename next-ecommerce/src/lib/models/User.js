/**
 * Mongoose User Model
 * Ready for MongoDB - use with bcrypt for password hashing in production
 * Run: npm install mongoose bcryptjs
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default in queries
      default: null, // OAuth users don't have password
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "facebook"],
      default: "credentials",
    },
    providerId: {
      type: String,
      default: null,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster lookups
userSchema.index({ email: 1 });

// Ensure _id as id for API consistency
userSchema.virtual("id").get(function () {
  return this._id?.toString();
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

/**
 * Optional: Hash password before save (uncomment when using bcrypt)
 * npm install bcryptjs
 *
 * userSchema.pre("save", async function (next) {
 *   if (!this.isModified("password")) return next();
 *   const bcrypt = await import("bcryptjs");
 *   this.password = await bcrypt.hash(this.password, 10);
 *   next();
 * });
 *
 * userSchema.methods.comparePassword = async function (candidate) {
 *   const bcrypt = await import("bcryptjs");
 *   return bcrypt.compare(candidate, this.password);
 * };
 */

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
