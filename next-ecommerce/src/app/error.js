"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">{error?.message || "An error occurred"}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  );
}
