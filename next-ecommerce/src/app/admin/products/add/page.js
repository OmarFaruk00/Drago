"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    image: "",
    images: [],
    weight: "",
    country: "",
    freeShipping: true,
    digitalItem: false,
    addTax: false,
    visible: true,
    metaTitle: "",
    metaDescription: "",
    tags: [],
    tagInput: "",
    selectedCategories: [],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    hasMultipleOptions: true,
    sizeVariants: [], // { size, price, stock }
    colors: [], // { name, hex }
    specifications: [], // { key, value }
    warranty: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setForm((f) => ({ ...f, category: f.category || data[0]?.name }));
        }
      })
      .catch(() => {});
  }, []);

  async function handleFileUpload(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setForm((f) => ({
            ...f,
            images: [...f.images, data.url],
            image: f.image || data.url,
          }));
        }
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addSizeVariant() {
    setForm((f) => ({
      ...f,
      sizeVariants: [...f.sizeVariants, { size: "", price: "", stock: "" }],
    }));
  }
  function updateSizeVariant(i, field, val) {
    setForm((f) => {
      const arr = [...f.sizeVariants];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, sizeVariants: arr };
    });
  }
  function removeSizeVariant(i) {
    setForm((f) => ({
      ...f,
      sizeVariants: f.sizeVariants.filter((_, idx) => idx !== i),
    }));
  }
  function addColor() {
    setForm((f) => ({
      ...f,
      colors: [...f.colors, { name: "", hex: "#000000" }],
    }));
  }
  function updateColor(i, field, val) {
    setForm((f) => {
      const arr = [...f.colors];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, colors: arr };
    });
  }
  function removeColor(i) {
    setForm((f) => ({
      ...f,
      colors: f.colors.filter((_, idx) => idx !== i),
    }));
  }
  function addSpecification() {
    setForm((f) => ({ ...f, specifications: [...f.specifications, { key: "", value: "" }] }));
  }
  function updateSpecification(i, field, val) {
    setForm((f) => {
      const arr = [...(f.specifications || [])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, specifications: arr };
    });
  }
  function removeSpecification(i) {
    setForm((f) => ({ ...f, specifications: (f.specifications || []).filter((_, idx) => idx !== i) }));
  }

  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag], tagInput: "" }));
    }
  }

  function removeTag(tag) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  function toggleCategory(cat) {
    const id = cat.id || cat;
    const name = cat.name || cat;
    setForm((f) => {
      const set = new Set(f.selectedCategories);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const arr = Array.from(set);
      const first = categories.find((c) => (c.id || c) === arr[0]);
      return {
        ...f,
        selectedCategories: arr,
        category: arr.length && first ? first.name : f.category,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const cat = form.selectedCategories.length
      ? categories.find((c) => c.id === form.selectedCategories[0])?.name
      : form.category || (categories[0]?.name || categories[0]);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description || "",
          price: parseFloat(form.price) || 0,
          stock: parseInt(form.stock, 10) || 0,
          category: cat || "General",
          image: form.image || form.images[0] || "https://via.placeholder.com/400",
          sizeVariants: form.sizeVariants
            .filter((v) => v.size && v.price != null)
            .map((v) => ({
              size: String(v.size).trim(),
              price: parseFloat(v.price) || 0,
              stock: parseInt(v.stock, 10) || 0,
            })),
          colors: form.colors
            .filter((c) => c.name && c.hex)
            .map((c) => ({ name: String(c.name).trim(), hex: String(c.hex).trim() })),
          specifications: (form.specifications || [])
            .filter((s) => s.key && s.value)
            .reduce((o, s) => ({ ...o, [String(s.key).trim()]: String(s.value).trim() }), {}),
          warranty: String(form.warranty || "").trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-brand rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Single card: Information, Images, Price, Options, Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Information</h2>
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Summer T-Shirt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Product description"
                />
              </div>
            </div>
            </div>

            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Images</h2>
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload({ target: { files: e.dataTransfer.files } });
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-brand text-sm font-medium hover:underline"
                >
                  Add File
                </button>
                <span className="text-sm text-gray-500">Or drag and drop files</span>
              </label>
              {form.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>

            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Price</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discountPrice}
                  onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Price at Discount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="0"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Add tax for this product</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.addTax}
                  onClick={() => setForm((f) => ({ ...f, addTax: !f.addTax }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.addTax ? "bg-brand" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.addTax ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </label>
            </div>
            </div>

            <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Different Options</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <span className="text-sm font-medium text-gray-700">This product has multiple options (Size / Color)</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.hasMultipleOptions}
                onClick={() => setForm((f) => ({ ...f, hasMultipleOptions: !f.hasMultipleOptions }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.hasMultipleOptions ? "bg-brand" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.hasMultipleOptions ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </label>
            {form.hasMultipleOptions && (
              <div className="space-y-6">
                {/* Size variants - each size can have different price & stock */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Size Options</h3>
                    <button
                      type="button"
                      onClick={addSizeVariant}
                      className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Size
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Add sizes with individual price & stock. E.g. M = 580৳, XL = 620৳
                  </p>
                  <div className="space-y-3">
                    {form.sizeVariants.map((v, i) => (
                      <div key={i} className="flex flex-wrap items-end gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50/30">
                        <div className="flex-1 min-w-[80px]">
                          <label className="block text-xs text-gray-500 mb-0.5">Size</label>
                          <input
                            type="text"
                            value={v.size}
                            onChange={(e) => updateSizeVariant(i, "size", e.target.value)}
                            placeholder="S, M, L, XL"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-[80px]">
                          <label className="block text-xs text-gray-500 mb-0.5">Price (৳)</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={v.price}
                            onChange={(e) => updateSizeVariant(i, "price", e.target.value)}
                            placeholder="580"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs text-gray-500 mb-0.5">Stock</label>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => updateSizeVariant(i, "stock", e.target.value)}
                            placeholder="10"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSizeVariant(i)}
                          className="p-2 text-gray-400 hover:text-brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Color Options</h3>
                    <button
                      type="button"
                      onClick={addColor}
                      className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Color
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.colors.map((c, i) => (
                      <div key={i} className="flex items-end gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50/30">
                        <div className="flex-1 min-w-[100px]">
                          <label className="block text-xs text-gray-500 mb-0.5">Color Name</label>
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => updateColor(i, "name", e.target.value)}
                            placeholder="Black, White, Red"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-0.5">Hex</label>
                            <div className="flex items-center gap-1">
                              <input
                                type="color"
                                value={c.hex || "#000000"}
                                onChange={(e) => updateColor(i, "hex", e.target.value)}
                                className="w-10 h-9 p-0.5 border border-gray-200 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={c.hex}
                                onChange={(e) => updateColor(i, "hex", e.target.value)}
                                placeholder="#000000"
                                className="w-24 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColor(i)}
                          className="p-2 text-gray-400 hover:text-brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Specification & Warranty - Add and modify anytime */}
            <div id="specification-warranty" className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-lg">
              <h2 className="text-base font-bold text-gray-900 mb-1">Specification & Warranty</h2>
              <p className="text-sm text-gray-500 mb-4">Add specifications (key-value) and warranty text. You can modify these later from the product edit page.</p>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Specification</h3>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Specification
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(form.specifications || []).map((s, i) => (
                      <div key={i} className="flex gap-2 items-end">
                        <input
                          type="text"
                          value={s.key}
                          onChange={(e) => updateSpecification(i, "key", e.target.value)}
                          placeholder="Key (e.g. Display Size)"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => updateSpecification(i, "value", e.target.value)}
                          placeholder="Value (e.g. 6.1 Inch)"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(i)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Warranty</h3>
                  <textarea
                    rows={3}
                    value={form.warranty}
                    onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))}
                    placeholder="e.g. 1 year manufacturer warranty"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Shipping</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.freeShipping}
                  onClick={() => setForm((f) => ({ ...f, freeShipping: !f.freeShipping }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.freeShipping ? "bg-brand" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.freeShipping ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Enter Weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  <option value="">Select Country</option>
                  <option value="BD">Bangladesh</option>
                  <option value="US">United States</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">This is digital item</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.digitalItem}
                onClick={() => setForm((f) => ({ ...f, digitalItem: !f.digitalItem }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.digitalItem ? "bg-brand" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.digitalItem ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </label>
            </div>
          </div>
        </div>

        {/* Right column - Settings sidebar */}
        <div className="space-y-6">
          {/* Categories Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              {(categories.length ? categories : [{ id: "1", name: "Electronics" }, { id: "2", name: "Fashion" }]).map(
                (c) => {
                  const id = c.id || c;
                  const name = c.name || c;
                  const checked = form.selectedCategories.includes(id) || (!form.selectedCategories.length && form.category === name);
                  return (
                    <label key={id} className="flex items-center gap-2 cursor-pointer" htmlFor={`cat-${id}`}>
                      <input
                        type="checkbox"
                        id={`cat-${id}`}
                        checked={checked}
                        onChange={() => toggleCategory(c)}
                      />
                      <span className="text-sm text-gray-700">{name}</span>
                    </label>
                  );
                }
              )}
            </div>
            <Link href="/admin/categories/add" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
              Create New
            </Link>
          </div>

          {/* Tags Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Tags</h2>
            <input
              type="text"
              value={form.tagInput}
              onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand mb-3"
              placeholder="Enter tag name"
            />
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {t} <button type="button" onClick={() => removeTag(t)} className="hover:text-brand">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Visibility Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Category Visibility</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Visible on site</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.visible}
                onClick={() => setForm((f) => ({ ...f, visible: !f.visible }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.visible ? "bg-brand" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.visible ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Action Buttons - bottom right of entire content, below both columns */}
        <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-brand font-medium bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
