"use client";

/**
 * ProfileAvatarCard - Profile picture with Choose + Delete buttons
 * 120px circular preview, outline red Choose, solid red Delete
 */

import { useRef, useState } from "react";

export default function ProfileAvatarCard({ currentImage, onImageChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-gray-100">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              👤
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Profile Picture</p>
          <p className="text-xs text-gray-500">PNG, JPEG under 10MB</p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-center sm:ml-auto">
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
          className="flex items-center gap-2 px-4 py-2 border-2 border-brand text-brand bg-white rounded hover:bg-brand/5 font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Choose
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
