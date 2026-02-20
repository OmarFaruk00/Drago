"use client";

/**
 * Product Detail Page - Interactive image gallery, identity, pricing, selection controls,
 * tabs (Specification, Description, Warranty), Related Products, dynamic breadcrumb
 */

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import {
  Maximize2,
  ShoppingCart,
  MessageCircle,
  Heart,
} from "lucide-react";

// Augment product with gallery images, variants (colors, sim, storage)
function augmentProduct(p) {
  if (!p) return null;
  const baseImg = p.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop";
  const images = p.images && Array.isArray(p.images) && p.images.length
    ? p.images
    : [baseImg, baseImg, baseImg, baseImg, baseImg, baseImg];
  const brand = p.brand || (p.category === "Electronics" ? "Samsung" : p.category || "Drago");
  const productCode = p.productCode ?? "1000";
  const colors = p.colors || [
    { name: "Pink", hex: "#ec4899" },
    { name: "White", hex: "#f8fafc" },
    { name: "Green", hex: "#86efac" },
    { name: "Beige", hex: "#fef3c7" },
    { name: "Black", hex: "#1f2937" },
    { name: "Purple", hex: "#a78bfa" },
  ];
  const simTypes = p.simTypes || ["Dual", "Single"];
  const storageVariants = p.storageVariants || [
    { label: "8/128GB", price: p.price },
    { label: "8/256GB", price: Math.round(p.price * 1.15) },
    { label: "8/512GB", price: Math.round(p.price * 1.35) },
  ];
  const specs = p.specifications || {
    Model: p.name,
    Brand: brand,
    Network: "GSM/CDMA/HSPA/EVDO",
    Dimensions: "146.3*70.9*7.6 mm",
    Weight: "168 grams",
    SIM: "Nano-SIM | eSIM | Dual SIM",
    "Display Type": "Dynamic AMOLED 2X",
    "Display Size": "6.1 Inch",
  };
  return { ...p, images, brand, productCode, colors, simTypes, storageVariants, specs };
}

export default function ProductDetailsPage() {
  const formatCurrency = useFormatCurrency();
  const params = useParams();
  const pathname = usePathname();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSim, setSelectedSim] = useState("Dual");
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specification");
  const [loading, setLoading] = useState(true);
  const addToCart = useStore((s) => s.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        const aug = augmentProduct(data);
        setProduct(aug);
        setSelectedColor(aug?.colors?.[0] ?? null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      const res = await fetch("/api/products");
      if (res.ok) {
        const list = await res.json();
        const related = (Array.isArray(list) ? list : [])
          .filter((p) => p.id !== product.id && p.category === product.category)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    };
    fetchRelated();
  }, [product?.id, product?.category]);

  const handleAddToCart = () => {
    if (!product) return;
    const variantPrice = product.storageVariants?.[selectedStorage]?.price ?? product.price;
    addToCart(
      { id: product.id, name: product.name, price: variantPrice, image: product.image },
      quantity
    );
  };

  const currentPrice = product?.storageVariants?.[selectedStorage]?.price ?? product?.price ?? 0;
  const regularPrice = product?.originalPrice ?? product?.price ?? 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link href="/products" className="text-brand hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  const breadcrumbPath = [
    { label: "Home", href: "/", current: false },
    { label: "Products", href: "/products", current: false },
    ...(product?.category ? [{ label: product.category, href: `/products?category=${encodeURIComponent(product.category)}`, current: false }] : []),
    { label: product?.name ?? "Product", href: pathname || "#", current: true },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb - dark bar in navbar area: Home > Products > Category > Product Name */}
      <nav className="w-full py-3 flex items-center gap-2 text-sm" style={{ backgroundColor: "#404040" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-2 flex-wrap">
          {breadcrumbPath.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/80">&gt;</span>}
              {item.current ? (
                <span className="text-brand font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-white hover:text-brand transition">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Interactive Image Gallery - constrained size to avoid excessive zoom */}
            <div className="space-y-4 w-full max-w-[450px]">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain object-center"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 450px"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 shadow border border-gray-200 text-gray-600 hover:bg-white transition"
                  aria-label="Zoom"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                      selectedImage === i
                        ? "border-brand"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Identity & Pricing */}
            <div>
              <p className="text-brand font-semibold">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-gray-500 text-sm">Cash Discount Price:</span>
                <span className="text-gray-400 line-through">{formatCurrency(regularPrice)}</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(currentPrice)}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-sm">
                  Status: <span className="text-green-600 font-medium ml-1">In Stock</span>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-sm text-gray-700">
                  Product Code: {product.productCode}
                </span>
              </div>
              <div className="flex gap-4 mt-4 text-sm text-gray-600">
                <Link href="#" className="flex items-center gap-1 hover:text-brand">
                  EMI Available View Plans
                </Link>
                <Link href="#" className="flex items-center gap-1 hover:text-brand">
                  Exchange View Plans
                </Link>
              </div>

              {/* Selection Controls */}
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Color:</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          selectedColor?.name === c.name
                            ? "border-brand ring-2 ring-brand/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sim:</p>
                  <div className="flex gap-2">
                    {product.simTypes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSim(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedSim === s
                            ? "bg-brand text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Storage:</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.storageVariants.map((st, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedStorage(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedStorage === i
                            ? "bg-brand text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to cart
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <a
                href="https://wa.me/8801923035628"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#25D366] text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                <MessageCircle className="w-5 h-5" />
                Message on Whatsapp
              </a>
            </div>
          </div>

          {/* Tabs: Specification, Description, Warranty */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { id: "specification", label: "Specification" },
                { id: "description", label: "Description" },
                { id: "warranty", label: "Warranty" },
                { id: "review", label: "Review" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-brand text-white border-b-2 border-brand"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "specification" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs || {}).map(([key, val]) => (
                        <tr key={key} className="border-b border-gray-100">
                          <td className="py-2 pr-4 font-medium text-gray-600 w-40">{key}</td>
                          <td className="py-2 text-gray-900">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "description" && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{product.description}</p>
                  {product.category === "Electronics" && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Features</h3>
                      <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Elegant design with premium build quality</li>
                        <li>Gorilla Glass protection</li>
                        <li>Advanced camera system</li>
                        <li>Long-lasting battery</li>
                      </ul>
                    </>
                  )}
                </div>
              )}
              {activeTab === "warranty" && (
                <p className="text-gray-700">
                  This product comes with a standard manufacturer warranty.{" "}
                  <Link href="/policy/warranty" className="text-brand hover:underline">
                    View Warranty Policy
                  </Link>{" "}
                  for full details.
                </p>
              )}
              {activeTab === "review" && (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products - light grey bg, white card container */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 py-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand/20 transition"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, 1);
                      }}
                      className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 shadow border border-gray-200 text-gray-600 hover:bg-brand hover:text-white transition"
                      aria-label="Quick add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-brand">
                      {p.name}
                    </h3>
                    <p className="text-brand font-semibold mt-1">{formatCurrency(p.price)}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className="text-amber-400"
                          style={{ fontSize: "12px" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
