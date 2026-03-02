"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

/**
 * AdminFooterLogoField - Footer logo upload with live preview and remove button.
 * - Live image preview on file select
 * - X button at top-right to clear (no save)
 * - New file replaces previous
 */
export default function AdminFooterLogoField({ value, onChange, label = "Footer Logo (optional)", placeholder = "Or paste image URL (optional)" }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const displayUrl = previewUrl || value;

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleRemove() {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFileSelect(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    setUploading(true);
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
        setPreviewUrl(null);
        onChange(data.url);
      } else {
        alert(data.error || "Upload failed");
        setPreviewUrl(null);
      }
    } catch {
      alert("Upload failed");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }
            onChange(e.target.value);
          }}
          className="flex-1 w-full min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
          placeholder={placeholder}
        />
      </div>
      {displayUrl && (
        <div className="mt-3 relative inline-block">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
            <img
              src={displayUrl}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove logo"
              className="absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
