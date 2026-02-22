"use client";

/**
 * Account Shopping Cart - Table layout with Cart Total and Active Coupons
 */

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { accountCoupons } from "@/lib/data/accountCoupons";

export default function AccountCartPage() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const formatCurrency = useFormatCurrency();

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to checkout.</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5"
          >
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Cart table */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Subtotal</th>
                    <th className="px-6 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/products/${item.id}`}
                            className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                          >
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                          </Link>
                          <Link href={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-brand">
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-brand"
                          title="Remove"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <Link
                href="/products"
                className="px-5 py-2.5 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5"
              >
                Return to shop
              </Link>
              <button
                className="px-5 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark"
                type="button"
              >
                Update Cart
              </button>
            </div>
          </div>

          {/* Active Coupons */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-100">
              Active Coupons
            </h3>
            <div className="p-6 space-y-4">
              {accountCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="bg-brand text-white px-4 py-2 flex justify-between items-center text-sm rounded-t-lg">
                    <span className="font-medium">Coupon</span>
                    <span>Valid Until {coupon.validUntil}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 bg-white">
                    <div className="flex items-center gap-3">
                      {coupon.id === "cp1" ? (
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{coupon.title}</p>
                        <p className="text-sm text-gray-500">{coupon.description}</p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 font-medium rounded-lg shrink-0 ${
                        coupon.applyVariant === "black"
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-brand text-white hover:bg-brand-dark"
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cart Total */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-100">
              Cart Total
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-600">Subtotal</td>
                    <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(subtotal)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-600">Shipping</td>
                    <td className="px-6 py-4 text-right text-gray-900">Free</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 pt-0">
              <Link
                href="/checkout"
                className="block w-full py-3 bg-brand text-white text-center font-semibold rounded-lg hover:bg-brand-dark"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
