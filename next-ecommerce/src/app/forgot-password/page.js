"use client";

/**
 * Forgot Password - Enter email to receive reset link
 */

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resetUrl, setResetUrl] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setDone(true);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[100vh] flex items-start justify-center pt-12 sm:pt-16 px-4 pb-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Password reset</h1>
            <p className="text-gray-600 text-sm mb-4">
              {resetUrl
                ? "If an account exists for " + email + ", use the link from your email to reset your password."
                : "If an account exists for " + email + ", we've sent a password reset link to your email."}
            </p>
            {resetUrl && (
              <a
                href={resetUrl}
                className="block w-full py-2.5 mb-4 text-center bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black"
              >
                Click here to reset password
              </a>
            )}
            <Link
              href="/login"
              className="block w-full py-2 text-center bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] flex items-start justify-center pt-12 sm:pt-16 px-4 pb-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">Forgot password</h1>
          <p className="text-gray-600 text-sm mb-4">Enter your email to receive a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2 bg-red-50 text-brand rounded-lg text-xs">{error}</div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600 text-xs">
            <Link href="/login" className="text-brand hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
