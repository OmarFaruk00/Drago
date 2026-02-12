"use client";

/**
 * LogoutModal - Logout confirmation for account dashboard
 * Center popup, white bg, rounded corners, dark backdrop
 * Cancel (gray outline) | Log Out (solid red)
 */

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Logout Confirmation</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to log out? You&apos;ll need to sign in again to access your client
          dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
