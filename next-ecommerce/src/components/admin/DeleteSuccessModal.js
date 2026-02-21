"use client";

/**
 * DeleteSuccessModal - Shown after successful deletion
 * Centered white modal, red circle with white checkmark, "Delete Successful" text, x close button
 */

import { Check, X } from "lucide-react";

export default function DeleteSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
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
            <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center">
              <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete Successful</h3>
        </div>
      </div>
    </div>
  );
}
