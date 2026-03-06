"use client";

/**
 * ProfileAvatarCard - Profile picture with Choose + Delete buttons
 * Uses User icon when no photo; shows uploaded picture when available
 */

import { useRef, useState, useEffect } from "react";
import { User } from "lucide-react";

export default function ProfileAvatarCard({ currentImage, onImageChange, loading }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageChange?.(file);
    e.target.value = "";
  };

  const handleDelete = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageChange?.(null);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-gray-100 min-w-0 w-full">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="w-14 h-14" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Profile Picture</p>
          <p className="text-xs text-gray-500">PNG, JPEG under 10MB</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-center sm:ml-auto flex-shrink-0">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleChoose}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border-2 border-brand text-brand bg-white rounded hover:bg-brand/5 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Choose
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
