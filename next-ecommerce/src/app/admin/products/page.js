"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Plus, ChevronDown, Search, X, FileText } from "lucide-react";

const ADMIN_IMG_PLACEHOLDER = "https://via.placeholder.com/48?text=No+Img";
const ALLOWED_IMG_HOSTS = ["images.unsplash.com", "via.placeholder.com", "res.cloudinary.com", "creassmart.com", "localhost", "127.0.0.1"];
function isAllowedImg(url) {
  if (!url || url.startsWith("/uploads/") || url.startsWith("data:") || url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    return ALLOWED_IMG_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
  } catch {
    return false;
  }
}
function extractImgUrl(url) {
  if (!url || !url.includes("google.com")) return url;
  try {
    const u = new URL(url);
    const imgurl = u.searchParams.get("imgurl");
    if (imgurl && imgurl.startsWith("http")) return decodeURIComponent(imgurl);
  } catch (_) {}
  return url;
}

function AdminProductImage({ src, alt }) {
  const resolved = extractImgUrl(src || ADMIN_IMG_PLACEHOLDER);
  const [imgSrc, setImgSrc] = useState(resolved || ADMIN_IMG_PLACEHOLDER);
  const needsUnopt = imgSrc?.startsWith("/uploads/") || imgSrc?.startsWith("data:") || !isAllowedImg(imgSrc);
  useEffect(() => {
    setImgSrc(extractImgUrl(src || ADMIN_IMG_PLACEHOLDER) || ADMIN_IMG_PLACEHOLDER);
  }, [src]);
  return (
    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
      <Image
        src={imgSrc}
        alt={alt || "Product"}
        width={48}
        height={48}
        className="w-full h-full object-cover"
        unoptimized={needsUnopt}
        onError={() => setImgSrc(ADMIN_IMG_PLACEHOLDER)}
      />
    </div>
  );
}
import ProductsEmptyState from "@/components/admin/ProductsEmptyState";
import DeleteSuccessModal from "@/components/admin/DeleteSuccessModal";
import ImportSuccessModal from "@/components/admin/ImportSuccessModal";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const perPage = 10;

  useEffect(() => {
    fetch("/api/admin/products", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    if (filterValue) {
      list = list.filter((p) => (p.category || "") === filterValue);
    }
    return list;
  }, [products, searchQuery, filterValue]);

  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;
  const paginated = filteredProducts.slice((page - 1) * perPage, page * perPage);
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const allSelected = paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id));
  const someSelected = paginated.some((p) => selectedIds.has(p.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.add(p.id));
        return next;
      });
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    const ids = [...selectedIds];
    setDeleting("bulk");
    try {
      for (const id of ids) {
        const res = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      }
      setSelectedIds(new Set());
      setShowDeleteSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  }

  function handleExport() {
    const data = filteredProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock ?? p.stockQuantity ?? 0,
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e) {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
      if (items.length === 0) {
        alert("No valid products found in file. Use JSON: [{ name, price, ... }] or { products: [...] }");
        return;
      }
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products: items }),
      });
      const json = await res.json();
      if (res.ok && json.imported > 0) {
        const data = await fetch("/api/admin/products", { credentials: "include" }).then((r) => r.json());
        setProducts(Array.isArray(data) ? data : []);
        setShowImportSuccess(true);
      } else {
        alert(json.error || "Import failed");
      }
    } catch (err) {
      alert("Invalid JSON file. Use format: [{ name, price, category?, image?, stock? }]");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand text-brand font-medium rounded-lg hover:bg-brand/5 transition"
          >
            Export
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            id="import-products"
          />
          <label
            htmlFor="import-products"
            className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer ${importing ? "opacity-60 pointer-events-none" : ""}`}
          >
            {importing ? "Importing..." : "Import"}
          </label>
          {products.length > 0 && (
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <ProductsEmptyState />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filters and search - inside the plate */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-200">
            <div className="relative flex-1 sm:max-w-[180px]">
              <select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="">Filter</option>
                {categories.map((c) => {
                  const val = typeof c === "object" ? (c.name || c.slug || c.id || "") : String(c);
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              <button
                onClick={() => someSelected && setShowDeleteConfirm(true)}
                disabled={deleting === "bulk" || !someSelected}
                className="p-2 rounded-full bg-gray-100 hover:bg-red-50 text-brand transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Inventory
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Color
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    Rating
                  </th>
                  <th className="text-right px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((p) => {
                  const stock = p.stock ?? p.stockQuantity ?? 0;
                  const inStock = p.inStock ?? stock > 0;
                  const color = p.color || (Array.isArray(p.colors) && p.colors[0]?.name) || "—";
                  const rating = p.rating ?? 0;
                  const votes = p.reviewCount ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <AdminProductImage src={p.image} alt={p.name} />
                          <div>
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {inStock ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Stock in ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Stock out
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{color}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {rating.toFixed(1)} ({votes} Votes)
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/add/${p.id}#specification-warranty`}
                          className="inline-flex p-2 rounded-full bg-gray-100 hover:bg-brand/10 text-gray-600 hover:text-brand transition"
                          title="Specification & Warranty"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/add/${p.id}`}
                          className="inline-flex p-2 rounded-full bg-gray-100 hover:bg-brand/10 text-gray-600 hover:text-brand transition ml-1"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {(() => {
                const pages = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1, 2, 3, 4, 5, 6);
                  pages.push(-1);
                  pages.push(totalPages);
                }
                return pages.map((pn) =>
                  pn === -1 ? (
                    <span key="ellipsis" className="px-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pn}
                      onClick={() => setPage(pn)}
                      className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${
                        pn === page
                          ? "bg-brand text-white border border-brand"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pn}
                    </button>
                  )
                );
              })()}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500">{filteredProducts.length} Results</p>
          </div>
        </div>
      )}

      <DeleteSuccessModal isOpen={showDeleteSuccess} onClose={() => setShowDeleteSuccess(false)} />
      <ImportSuccessModal isOpen={showImportSuccess} onClose={() => setShowImportSuccess(false)} />

      {/* Delete Items confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60"
            onClick={() => setShowDeleteConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="pt-10 pb-6 px-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Items</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete {selectedIds.size} selected item{selectedIds.size !== 1 ? "s" : ""}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-brand font-medium hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleBulkDelete();
                  }}
                  disabled={deleting === "bulk"}
                  className="px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
