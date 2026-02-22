import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div>
      {/* Breadcrumb bar - matches AccountBreadcrumb style */}
      <nav
        className="w-full py-3 flex items-center gap-2 text-sm"
        style={{ backgroundColor: "#404040" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white hover:text-brand transition"
            aria-label="Home"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>
          <span className="text-white">&gt;</span>
          <span className="text-white">404 error page</span>
        </div>
      </nav>

      {/* Main content - white background, centered */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* 404 Image - place 404.png or 404.jpg in public folder */}
            <div className="relative w-full max-w-xl mb-8">
              <Image
                src="/404.png"
                alt="404 - Page not found"
                width={560}
                height={400}
                className="w-full h-auto object-contain"
                priority
                unoptimized
              />
            </div>
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Oops! page not found
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base max-w-md mb-8">
              Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros.
              Maecenas sagittis tortor at metus mollis
            </p>

            {/* Back to Home button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-white font-medium bg-brand hover:bg-brand-dark transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
