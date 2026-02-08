/**
 * App configuration
 * USE_MONGODB: true when MONGODB_URI env var is set (MongoDB connected)
 * When false, API uses dummy JSON data
 */

export const USE_MONGODB = !!process.env.MONGODB_URI;
