"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const REASONS = [
  "General inquiry",
  "Host / property owner question",
  "Provider listing question",
  "Billing or subscription issue",
  "Report a problem with a listing",
  "Partnership or sponsorship",
  "Media or press inquiry",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    reason: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setFormData({ name: "", email: "", business: "", reason: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-3 text-lg font-semibold text-emerald-900">Message sent!</h3>
        <p className="mt-2 text-sm text-emerald-700">
          Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-emerald-800 underline hover:text-emerald-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-stone-900">
            Your name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-stone-900">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="business" className="block text-sm font-semibold text-stone-900">
            Business name (optional)
          </label>
          <input
            id="business"
            type="text"
            value={formData.business}
            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
            placeholder="Your company name"
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-stone-900">
            Reason for contact <span className="text-red-500">*</span>
          </label>
          <select
            id="reason"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
          >
            <option value="">Select a reason…</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-stone-900">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200"
          placeholder="Tell us how we can help…"
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          Something went wrong. Please try again or email us directly at{" "}
          <a href="mailto:contact@poconossrt.com" className="font-semibold underline">contact@poconossrt.com</a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-pine-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pine-900 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
