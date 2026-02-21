"use client";

/**
 * ImportSuccessModal - Shown after successful product import
 * Light blue/gray circle with red checkmark, "Import Successful", subtext, Continue button
 */

import { Check, X } from "lucide-react";

export default function ImportSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="pt-10 pb-8 px-6 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
              <Check className="w-7 h-7 text-brand" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Import Successful</h3>
          <p className="text-sm text-gray-500 mb-6">Added new products to your store.</p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
