/**
 * Testimonial - Customer reviews for "What Our Customers Say" section
 */

import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Customer", trim: true },
    avatar: { type: String, default: "", trim: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    status: { type: String, default: "active", enum: ["active", "hidden"] },
  },
  { timestamps: true }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
