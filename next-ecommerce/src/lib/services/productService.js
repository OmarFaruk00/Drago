/**
 * Product Service - Real data only (MongoDB).
 * When MONGODB_URI is not set, returns empty/null.
 */

import { USE_MONGODB } from "@/lib/config";
import connectDB from "@/lib/db/mongodb";

const BROKEN_UNSPLASH_ID = "photo-1543512214-659c93580adc";
const FIXED_IMAGE_LG =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&h=400&q=80";
const FIXED_IMAGE_SM =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&h=200&q=80";

function fixBrokenImage(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes(BROKEN_UNSPLASH_ID)) return url;
  if (url.includes("w=200")) return FIXED_IMAGE_SM;
  return FIXED_IMAGE_LG;
}

function normalizeProduct(product) {
  if (!product) return product;
  return {
    ...product,
    image: fixBrokenImage(product.image),
  };
}

export async function getProducts(filters = {}) {
  if (!USE_MONGODB) return [];
  const conn = await connectDB();
  if (!conn) return [];

  const Product = (await import("@/lib/models/Product")).default;
  const { category, search, inStock } = filters;
  const query = {};
  if (category) query.category = category;
  if (inStock === true || inStock === "true") query.inStock = true;
  if (search) {
    const words = search.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      // fallback: whole phrase
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } else {
      // word-by-word: each word must match in name or description
      query.$and = words.map((word) => ({
        $or: [
          { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          { description: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        ],
      }));
    }
  }
  const docs = await Product.find(query).lean();
  return docs.map(toApiProduct).map(normalizeProduct);
}

export async function getProductById(id) {
  if (!USE_MONGODB) return null;
  const conn = await connectDB();
  if (!conn) return null;

  const mongoose = await import("mongoose");
  const Product = (await import("@/lib/models/Product")).default;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Product.findById(id).lean();
  return doc ? normalizeProduct(toApiProduct(doc)) : null;
}

export async function getCategoriesList() {
  if (!USE_MONGODB) return [];
  const conn = await connectDB();
  if (!conn) return [];
  const Product = (await import("@/lib/models/Product")).default;
  const cats = await Product.distinct("category");
  return cats.sort();
}

function toApiProduct(doc) {
  return {
    id: doc._id?.toString(),
    ...doc,
    _id: undefined,
    __v: undefined,
  };
}

/** Get products by IDs, returned in the same order as idList (missing IDs skipped). */
export async function getProductsByIds(idList) {
  if (!USE_MONGODB || !Array.isArray(idList) || idList.length === 0) return [];
  const conn = await connectDB();
  if (!conn) return [];

  const mongoose = await import("mongoose");
  const Product = (await import("@/lib/models/Product")).default;
  const validIds = idList.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length === 0) return [];

  const docs = await Product.find({ _id: { $in: validIds } }).lean();
  const byId = Object.fromEntries(docs.map((d) => [d._id.toString(), d]));
  return validIds.map((id) => byId[id]).filter(Boolean).map(toApiProduct).map(normalizeProduct);
}
