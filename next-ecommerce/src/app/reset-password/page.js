"use client";

/**
 * Reset Password - Set new password with token from email
 */

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid or expired link");
        return;
      }
      setDone(true);
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
            <h1 className="text-xl font-bold text-gray-900 mb-2">Password updated</h1>
            <p className="text-gray-600 text-sm mb-4">You can now sign in with your new password.</p>
            <Link
              href="/login"
              className="block w-full py-2 text-center bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[100vh] flex items-start justify-center pt-12 sm:pt-16 px-4 pb-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
            <p className="text-gray-600 text-sm mb-4">This reset link is invalid or expired. Please request a new one.</p>
            <Link
              href="/forgot-password"
              className="block w-full py-2 text-center bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark"
            >
              Forgot password
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
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">Reset password</h1>
          <p className="text-gray-600 text-sm mb-4">Enter your new password</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2 bg-red-50 text-brand rounded-lg text-xs">{error}</div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
