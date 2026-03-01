"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";

/**
 * AdminImageUrlField - Upload button + optional URL input.
 * Use wherever admin needs image URL: click to upload or paste URL.
 */
export default function AdminImageUrlField({ value, onChange, label = "Image", placeholder = "Or paste image URL (optional)" }) {
  const inputRef = useRef(null);

  async function handleUpload(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
          placeholder={placeholder}
        />
      </div>
      {value && (
        <div className="mt-2 flex items-start gap-2">
          <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
            title="Remove image"
          >
            <X className="w-4 h-4" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
