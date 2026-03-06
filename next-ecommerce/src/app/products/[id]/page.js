"use client";

/**
 * Product Detail Page - Interactive image gallery, identity, pricing, selection controls,
 * tabs (Specification, Description, Warranty), Related Products, dynamic breadcrumb
 */

import { useEffect, useState, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import SafeProductImage from "@/components/SafeProductImage";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { useFlashSaleCountdown } from "@/lib/utils/useFlashSaleCountdown";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Maximize2,
  ShoppingCart,
  MessageCircle,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function extractDirectImageUrl(url) {
  if (!url || !url.includes("google.com")) return url;
  try {
    const u = new URL(url);
    const imgurl = u.searchParams.get("imgurl");
    if (imgurl && imgurl.startsWith("http")) return decodeURIComponent(imgurl);
  } catch (_) {}
  return url;
}

// Augment product with gallery images, variants (colors, sim, storage)
function augmentProduct(p) {
  if (!p) return null;
  const baseImg = p.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop";
  const raw = p.images && Array.isArray(p.images) && p.images.length ? p.images : [baseImg, baseImg, baseImg, baseImg, baseImg, baseImg];
  const images = raw.map((img) => extractDirectImageUrl(img));
  const brand = p.brand || (p.category === "Electronics" ? "Samsung" : p.category || "Drago");
  const productCode = (p.productCode != null && String(p.productCode).trim()) ? String(p.productCode).trim() : "";
  const colors = (p.colors && p.colors.length > 0) ? p.colors : [
    { name: "Pink", hex: "#ec4899" },
    { name: "White", hex: "#f8fafc" },
    { name: "Green", hex: "#86efac" },
    { name: "Beige", hex: "#fef3c7" },
    { name: "Black", hex: "#1f2937" },
    { name: "Purple", hex: "#a78bfa" },
  ];
  const sizeVariants = (p.sizeVariants && p.sizeVariants.length > 0) ? p.sizeVariants : null;
  const simTypes = (p.simTypes && Array.isArray(p.simTypes) && p.simTypes.length > 0) ? p.simTypes : null;
  const storageVariants = (p.storageVariants && p.storageVariants.length > 0)
    ? p.storageVariants
    : (sizeVariants ? sizeVariants.map((sv) => ({ label: sv.size, price: sv.price })) : null);
  const specs = (p.specifications && typeof p.specifications === "object" && Object.keys(p.specifications).length > 0)
    ? p.specifications
    : {};
  return { ...p, images, brand, productCode, colors, sizeVariants, simTypes, storageVariants, specs };
}

function FlashSaleTimer({ endTime }) {
  const timeLeft = useFlashSaleCountdown(endTime ?? null);
  const items = [
    { label: "Day", value: timeLeft.days },
    { label: "Hour", value: timeLeft.hrs },
    { label: "Min", value: timeLeft.min },
    { label: "Sec", value: timeLeft.sec },
  ];
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider text-gray-600">{label}</span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm sm:text-base font-bold tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailsPage() {
  const formatCurrency = useFormatCurrency();
  const { t } = useLanguage();
  const params = useParams();
  const pathname = usePathname();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSim, setSelectedSim] = useState("Dual");
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specification");
  const [loading, setLoading] = useState(true);
  const [zoomLightboxOpen, setZoomLightboxOpen] = useState(false);
  const [zoomLens, setZoomLens] = useState({ show: false, x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const router = useRouter();
  const addToCart = useStore((s) => s.addToCart);
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const isInWishlist = product && wishlist?.some((w) => w.id === product.id);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(null);

  useEffect(() => {
    if (!product?.id) return;
    fetch("/api/flash-sale")
      .then((r) => r.json())
      .then((data) => {
        if (data.active && Array.isArray(data.productIds) && data.productIds.includes(product.id)) {
          setFlashSaleEndTime(data.endTime ?? null);
        } else {
          setFlashSaleEndTime(null);
        }
      })
      .catch(() => setFlashSaleEndTime(null));
  }, [product?.id]);

  // Scroll to top on load to prevent footer jump on certain viewport sizes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        const aug = augmentProduct(data);
        setProduct(aug);
        setSelectedColor(aug?.colors?.[0] ?? null);
        setSelectedSize(0);
        setSelectedStorage(0);
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
    const variantPrice = product.sizeVariants?.[selectedSize]?.price ?? product.storageVariants?.[selectedStorage]?.price ?? product.price;
    addToCart(
      { id: product.id, name: product.name, price: variantPrice, image: product.image },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    const variantPrice = product.sizeVariants?.[selectedSize]?.price ?? product.storageVariants?.[selectedStorage]?.price ?? product.price;
    const item = { id: product.id, name: product.name, price: variantPrice, image: product.image, quantity };
    try {
      sessionStorage.setItem("buyNowItem", JSON.stringify(item));
    } catch (_) {}
    router.push("/checkout");
  };

  const currentPrice = product?.sizeVariants?.[selectedSize]?.price ?? product?.storageVariants?.[selectedStorage]?.price ?? product?.price ?? 0;
  const regularPrice = product?.originalPrice ?? product?.price ?? 0;
  const isFlashSale = product && flashSaleEndTime != null;

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link href="/products" className="text-brand hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Interactive Image Gallery - hover zoom + lightbox for all angles */}
            <div className="space-y-4 w-full max-w-full lg:max-w-[450px]">
              <div
                ref={imageContainerRef}
                className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 cursor-zoom-in"
                onMouseMove={(e) => {
                  if (!imageContainerRef.current) return;
                  const rect = imageContainerRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    setZoomLens({ show: true, x: e.clientX, y: e.clientY, localX: x, localY: y, rectWidth: rect.width, rectHeight: rect.height });
                  }
                }}
                onMouseLeave={() => setZoomLens((p) => ({ ...p, show: false }))}
                onClick={() => setZoomLightboxOpen(true)}
              >
                <SafeProductImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain object-center select-none pointer-events-none"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 450px"
                />
                {/* Hover zoom lens - desktop: shows 2x zoom near cursor */}
                {zoomLens.show && zoomLens.rectWidth && (
                  <div
                    className="hidden md:block absolute w-32 h-32 rounded-full border-2 border-white shadow-xl bg-gray-100 pointer-events-none"
                    style={{
                      left: Math.max(0, Math.min(zoomLens.rectWidth - 128, zoomLens.localX - 64)),
                      top: Math.max(0, Math.min(zoomLens.rectHeight - 128, zoomLens.localY - 64)),
                      backgroundImage: `url(${product.images[selectedImage]})`,
                      backgroundSize: `${zoomLens.rectWidth * 2}px ${zoomLens.rectHeight * 2}px`,
                      backgroundPosition: `${-((zoomLens.localX / zoomLens.rectWidth) * zoomLens.rectWidth * 2) + 64}px ${-((zoomLens.localY / zoomLens.rectHeight) * zoomLens.rectHeight * 2) + 64}px`,
                    }}
                  />
                )}
                <button
                  type="button"
                  className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 shadow border border-gray-200 text-gray-600 hover:bg-white transition pointer-events-auto"
                  aria-label="Zoom"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLightboxOpen(true);
                  }}
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
                    <SafeProductImage src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Identity & Pricing */}
            <div>
              {isFlashSale && (
                <div className="mb-4 p-3 rounded-lg bg-brand/10 border border-brand flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-brand text-white text-sm font-semibold mb-2">
                      {t("product.flashSaleBadge")}
                    </span>
                    <p className="text-gray-700 text-sm font-medium">
                      {t("product.flashSaleLabel")}
                    </p>
                  </div>
                  <FlashSaleTimer endTime={flashSaleEndTime} />
                </div>
              )}
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
                <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  Status: {product.inStock ? "Stock in" : "Stock out"}
                </span>
                {product.freeShipping && (
                  <span className="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-emerald-100 text-emerald-800">
                    Free Shipping
                  </span>
                )}
                {product.productCode && (
                  <span className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-sm text-gray-700">
                    Product Code: {product.productCode}
                  </span>
                )}
              </div>
              {/* Selection Controls */}
              <div className="mt-6 space-y-4">
                {product.sizeVariants && product.sizeVariants.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizeVariants.map((sv, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedSize(i)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            selectedSize === i
                              ? "bg-brand text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {sv.size} - {formatCurrency(sv.price)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
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
                )}
                {!product.sizeVariants?.length && product.simTypes && product.simTypes.length > 0 && (
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
                )}
                {!product.sizeVariants?.length && product.storageVariants && product.storageVariants.length > 0 && (
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
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-0 sm:min-w-[240px] px-4 sm:px-10 py-3 sm:py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
                  >
                    Buy now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-0 sm:min-w-[240px] px-4 sm:px-10 py-3 sm:py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to cart
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!product) return;
                    if (isInWishlist) removeFromWishlist(product.id);
                    else addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, inStock: product.inStock });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                    isInWishlist ? "border-brand/50 text-brand bg-brand/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`} strokeWidth={2} />
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
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val]) => (
                          <tr key={key} className="border-b border-gray-100">
                            <td className="py-2 pr-4 font-medium text-gray-600 w-40">{key}</td>
                            <td className="py-2 text-gray-900">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">No specifications added.</p>
                  )}
                </div>
              )}
              {activeTab === "description" && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  {isFlashSale && (
                    <p className="rounded-lg bg-brand/10 border border-brand p-3 text-brand font-medium mb-4">
                      {t("product.flashSaleLabel")}
                    </p>
                  )}
                  <div className="whitespace-pre-wrap">{product.description || t("product.noDescription") || "No description added."}</div>
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
                    <SafeProductImage
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
                    <p className="text-base text-brand font-semibold mt-1">{formatCurrency(p.price)}</p>
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

      {/* Zoom Lightbox - view image large + all angles */}
      {zoomLightboxOpen && product?.images?.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setZoomLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
        >
          <button
            type="button"
            onClick={() => setZoomLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedImage((prev) => (prev <= 0 ? product.images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="relative w-full h-full min-h-[50vh] max-h-[85vh] flex items-center justify-center">
              <SafeProductImage
                src={product.images[selectedImage]}
                alt={`${product.name} - view ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage((prev) => (prev >= product.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            {selectedImage + 1} / {product.images.length}
          </p>
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === i ? "border-white ring-2 ring-white/50" : "border-white/30 hover:border-white/60"
                }`}
              >
                <SafeProductImage src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
