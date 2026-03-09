"use client";

import AddProductPage from "../page";

export default function EditProductPage({ params }) {
  return <AddProductPage productId={params?.id} />;
}
