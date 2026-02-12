"use client";

/**
 * Wishlist - Table layout with Product, Price, Stock Status, Action
 */

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { wishlistItems } from "@/lib/data/dashboard";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const formatCurrency = useFormatCurrency();

  const items = wishlist.length > 0 ? wishlist : wishlistItems.map((p) => ({ ...p, inStock: p.inStock ?? true }));
  const isStoreWishlist = wishlist.length > 0;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-100">Wishlist</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link href={`/products/${item.id}`} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                      </Link>
                      <Link href={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-red-600">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }, 1)}
                        disabled={!item.inStock}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      {isStoreWishlist && (
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link href="/products" className="text-red-600 font-medium hover:underline">
              Browse products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
