"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_tier: string;
  subscription_status: string;
}

interface Provider {
  id: string;
  name: string;
  category: string;
  tier: string;
  is_active: boolean;
  slug: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      if (profileData?.role === "provider") {
        const { data: providerData } = await supabase
          .from("providers")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setProvider(providerData);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-stone-200" />
          <div className="h-4 w-64 rounded bg-stone-200" />
          <div className="h-32 rounded-xl bg-stone-100" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Welcome back, {profile.full_name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-stone-600">{profile.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
        >
          Sign Out
        </button>
      </div>

      {/* Subscription Status */}
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Your Plan</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded-full bg-pine-50 px-3 py-1 text-sm font-semibold text-pine-800">
            {profile.subscription_tier || "No plan"}
          </span>
          <span className="text-sm text-stone-500">
            {profile.subscription_status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
        {!profile.subscription_tier && (
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-pine-900"
          >
            Upgrade Your Plan
          </Link>
        )}
      </div>

      {/* Provider Listing */}
      {profile.role === "provider" && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Your Listing</h2>
          {provider ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-pine-50 px-3 py-1 text-sm font-semibold text-pine-800">
                  {provider.category}
                </span>
                <span className="text-sm text-stone-600">{provider.name}</span>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/providers/${provider.slug}`}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  View Listing
                </Link>
                <Link
                  href={`/dashboard/edit`}
                  className="rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-pine-900"
                >
                  Edit Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-stone-600">
                You haven&apos;t created a listing yet. Add your business to the directory.
              </p>
              <Link
                href="/dashboard/claim"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-pine-900"
              >
                Create Your Listing
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Host Dashboard */}
      {profile.role === "host" && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Your Favorites</h2>
          <p className="mt-2 text-sm text-stone-600">
            Save providers to your favorites list for quick access.
          </p>
          <Link
            href="/providers"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-pine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-pine-900"
          >
            Browse Providers
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/providers"
          className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm hover:border-pine-300"
        >
          <p className="text-2xl">🔍</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">Browse Directory</p>
        </Link>
        <Link
          href="/pricing"
          className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm hover:border-pine-300"
        >
          <p className="text-2xl">💳</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">Manage Billing</p>
        </Link>
        <Link
          href="/about"
          className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm hover:border-pine-300"
        >
          <p className="text-2xl">💬</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">Contact Support</p>
        </Link>
      </div>
    </div>
  );
}
