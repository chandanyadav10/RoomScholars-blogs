"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const error = searchParams.get("error");

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(error ? "Invalid credentials. Please try again." : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setErr("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen bg-[#07122B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F5A623] rounded-xl flex items-center justify-center">
              <span className="text-[#07122B] font-bold">RS</span>
            </div>
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              Room<span className="text-[#F5A623]">Scholars</span>
            </span>
          </Link>
          <p className="mt-3 text-gray-400 text-sm">Admin Dashboard Login</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-[#07122B] mb-6" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Sign In
          </h1>

          {err && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#07122B]"
                placeholder="admin@roomscholars.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#07122B]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#07122B] text-white py-3.5 rounded-xl font-bold hover:bg-[#0d1f4a] disabled:opacity-50 transition text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
            <strong>Demo credentials:</strong><br />
            Email: <code>admin@roomscholars.com</code><br />
            Password: <code>admin123</code>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
