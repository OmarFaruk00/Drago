import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Go home
      </Link>
    </div>
  );
}
