/**
 * Product Service - Abstraction layer for product data
 * Uses dummy JSON when MONGODB_URI is not set
 * Uses Mongoose Product model when MongoDB is connected
 */

import { USE_MONGODB } from "@/lib/config";
import connectDB from "@/lib/db/mongodb";
import { products, getCategories } from "@/lib/data/products";

/**
 * Get all products with optional filters
 * @param {Object} filters - { category, search, inStock }
 * @returns {Promise<Array>} List of products
 */
export async function getProducts(filters = {}) {
  if (!USE_MONGODB) {
    return getProductsFromDummy(filters);
  }
  return getProductsFromMongo(filters);
}

/**
 * Get single product by ID
 * @param {string} id - Product ID (string for dummy, ObjectId for Mongo)
 * @returns {Promise<Object|null>} Product or null
 */
export async function getProductById(id) {
  if (!USE_MONGODB) {
    return getProductByIdFromDummy(id);
  }
  return getProductByIdFromMongo(id);
}

/**
 * Get unique categories (for filters)
 */
export async function getCategoriesList() {
  if (!USE_MONGODB) {
    return getCategories();
  }
  return getCategoriesFromMongo();
}

// --- Dummy data implementation ---
function getProductsFromDummy(filters) {
  let result = [...products];
  const { category, search, inStock } = filters;

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.description && p.description.toLowerCase().includes(s))
    );
  }
  if (inStock === true || inStock === "true") {
    result = result.filter((p) => p.inStock);
  }
  return result;
}

function getProductByIdFromDummy(id) {
  return products.find((p) => p.id === id) || null;
}

// --- MongoDB implementation ---
async function getProductsFromMongo(filters) {
  const conn = await connectDB();
  if (!conn) return getProductsFromDummy(filters);

  const Product = (await import("@/lib/models/Product")).default;
  const { category, search, inStock } = filters;

  const query = {};

  if (category) query.category = category;
  if (inStock === true || inStock === "true") query.inStock = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const docs = await Product.find(query).lean();
  return docs.map(toApiProduct);
}

async function getProductByIdFromMongo(id) {
  const conn = await connectDB();
  if (!conn) return getProductByIdFromDummy(id);

  const mongoose = await import("mongoose");
  const Product = (await import("@/lib/models/Product")).default;

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) return null;

  const doc = await Product.findById(id).lean();
  return doc ? toApiProduct(doc) : null;
}

async function getCategoriesFromMongo() {
  const conn = await connectDB();
  if (!conn) return getCategories();

  const Product = (await import("@/lib/models/Product")).default;
  const cats = await Product.distinct("category");
  return cats.sort();
}

// Normalize Mongo document to API shape (id instead of _id)
function toApiProduct(doc) {
  return {
    id: doc._id?.toString(),
    ...doc,
    _id: undefined,
    __v: undefined,
  };
}
