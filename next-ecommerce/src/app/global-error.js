"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error?.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
