"use client";

/**
 * Register Page - Modern User Registration Form
 * First Name, Last Name, Email, Mobile, Password, Confirm Password,
 * DOB (optional), Gender (optional), Referral (optional), Terms checkbox, Social login
 */

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+880", country: "BD" },
  { code: "+91", country: "IN" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
];

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email?.trim() || "");
}

function validateMobile(phone, countryCode) {
  const full = `${countryCode}${phone}`.replace(/\D/g, "");
  return full.length >= 10;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+880",
    mobile: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    referralCode: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "First name is required";
    if (!form.lastName?.trim()) e.lastName = "Last name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Please enter a valid email address";
    if (!form.mobile?.trim()) e.mobile = "Mobile number is required";
    else if (!validateMobile(form.mobile, form.countryCode)) e.mobile = "Enter a valid mobile number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to the Terms & Privacy Policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    const fullPhone = `${form.countryCode}${form.mobile.replace(/\D/g, "")}`;
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          password: form.password,
          name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Registration failed");
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/", prompt: "select_account" });
  };

  const inputBase =
    "w-full px-4 py-2.5 text-sm border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none placeholder:text-gray-400 transition-all";
  const inputError = "border-red-300 focus:ring-red-200 focus:border-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand font-medium hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                {submitError}
              </div>
            )}

            {/* First Name & Last Name - side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`${inputBase} ${errors.firstName ? inputError : "border-gray-200"}`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`${inputBase} ${errors.lastName ? inputError : "border-gray-200"}`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`${inputBase} ${errors.email ? inputError : "border-gray-200"}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number with country code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className={`w-24 px-2 py-2.5 text-sm border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none ${errors.mobile ? "border-red-300" : "border-gray-200"}`}
                >
                  {COUNTRY_CODES.map(({ code, country }) => (
                    <option key={code} value={code}>
                      {code} {country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="1712345678"
                  className={`flex-1 ${inputBase} ${errors.mobile ? inputError : "border-gray-200"}`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
              )}
            </div>

            {/* Password with show/hide */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`${inputBase} pr-10 ${errors.password ? inputError : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`${inputBase} pr-10 ${errors.confirmPassword ? inputError : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Date of Birth - optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={`${inputBase} border-gray-200`}
              />
            </div>

            {/* Gender - optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Referral Code - optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Code <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code"
                className={`${inputBase} border-gray-200`}
              />
            </div>

            {/* Terms & Privacy checkbox */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-brand hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/policy/privacy" className="text-brand hover:underline">
                    Privacy Policy
                  </Link> *
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(255,26,10,0.25)] hover:shadow-[0_6px_20px_rgba(255,26,10,0.35)] active:scale-[0.99]"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-500 text-xs">Or sign up with</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-sm font-medium text-gray-700 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn("facebook")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-sm font-medium text-gray-700 shadow-sm"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
