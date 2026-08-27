"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"provider" | "host">("host");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl mx-auto">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">Check your email</h1>
        <p className="mt-3 text-stone-600">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        Create your account
      </h1>
      <p className="mt-2 text-stone-600">
        Join the Poconos STR Directory as a provider or host.
      </p>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">I am a...</label>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setRole("host")}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                role === "host"
                  ? "border-pine-600 bg-pine-50 text-pine-800"
                  : "border-stone-300 text-stone-600 hover:bg-stone-50"
              }`}
            >
              Property Host
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                role === "provider"
                  ? "border-pine-600 bg-pine-50 text-pine-800"
                  : "border-stone-300 text-stone-600 hover:bg-stone-50"
              }`}
            >
              Service Provider
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
          />
          <p className="mt-1 text-xs text-stone-500">At least 6 characters</p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-pine-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-pine-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
