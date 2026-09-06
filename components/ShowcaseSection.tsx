"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface ShowcaseImage {
  url?: string;
  caption: string;
  source: "provider" | "sample";
}

interface ShowcaseTestimonial {
  text: string;
  author: string;
  rating: number;
  source?: string;
}

interface ShowcaseProps {
  providerName: string;
  category: Category;
  rating: number;
  reviewCount: number;
  showcaseImages: ShowcaseImage[];
  testimonials: ShowcaseTestimonial[];
  isSubscribed: boolean;
}

const CATEGORY_THEME: Record<
  Category,
  { gradient: string; icon: string; label: string }
> = {
  cleaning: {
    gradient: "from-teal-500 to-cyan-600",
    icon: "🧹",
    label: "Turnover Cleaning",
  },
  hvac: {
    gradient: "from-orange-500 to-red-500",
    icon: "❄️",
    label: "HVAC & Heating",
  },
  maintenance: {
    gradient: "from-amber-600 to-orange-700",
    icon: "🔧",
    label: "Handyman & Repairs",
  },
  plumbing: {
    gradient: "from-blue-500 to-blue-700",
    icon: "🔩",
    label: "Plumbing",
  },
  electrical: {
    gradient: "from-yellow-400 to-amber-500",
    icon: "⚡",
    label: "Electrical",
  },
  landscaping: {
    gradient: "from-green-500 to-emerald-600",
    icon: "🌿",
    label: "Landscaping",
  },
  "snow-removal": {
    gradient: "from-sky-400 to-blue-500",
    icon: "❄️",
    label: "Snow Removal",
  },
  linens: {
    gradient: "from-purple-400 to-purple-600",
    icon: "🛏️",
    label: "Linen Supply",
  },
  photography: {
    gradient: "from-pink-400 to-rose-500",
    icon: "📷",
    label: "Photography & Staging",
  },
  suppliers: {
    gradient: "from-stone-500 to-stone-700",
    icon: "🪑",
    label: "Furniture & Supplies",
  },
  hottub: {
    gradient: "from-cyan-500 to-blue-600",
    icon: "🛁",
    label: "Hot Tub Service",
  },
  pest: {
    gradient: "from-emerald-600 to-green-700",
    icon: "🐛",
    label: "Pest Control",
  },
  trash: {
    gradient: "from-gray-500 to-gray-700",
    icon: "🗑️",
    label: "Trash Valet",
  },
};

const VISIBLE_IMAGES = 2;
const VISIBLE_REVIEWS = 1;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm ${i <= rating ? "text-amber-400" : "text-stone-300"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ShowcaseCard({
  image,
  theme,
  index,
  blurred,
}: {
  image: ShowcaseImage;
  theme: { gradient: string; icon: string; label: string };
  index: number;
  blurred: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        blurred ? "h-48" : "h-56"
      } min-w-[200px] flex-shrink-0 snap-center`}
    >
      {image.url ? (
        <img
          src={image.url}
          alt={image.caption}
          className={`h-full w-full object-cover transition-all duration-500 ${
            blurred ? "scale-110 blur-md" : ""
          }`}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${theme.gradient} ${
            blurred ? "blur-sm scale-110" : ""
          } transition-all duration-500 flex flex-col items-center justify-center p-4`}
        >
          <span className="text-4xl mb-2">{theme.icon}</span>
          <span className="text-white/90 text-sm font-semibold text-center">
            {theme.label}
          </span>
          <span className="text-white/60 text-xs mt-1">{image.caption}</span>
        </div>
      )}
      {blurred && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-lg">
            🔒
          </div>
          <p className="mt-2 text-xs font-semibold text-white drop-shadow">
            {index === VISIBLE_IMAGES ? "Unlock full showcase" : ""}
          </p>
        </div>
      )}
      {image.source === "sample" && !blurred && (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
          Sample
        </span>
      )}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  blurred,
}: {
  testimonial: ShowcaseTestimonial;
  blurred: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${
        blurred ? "select-none" : ""
      }`}
    >
      <div className={`transition-all duration-500 ${blurred ? "blur-sm" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={testimonial.rating} />
          <span className="text-xs text-stone-500">{testimonial.rating}/5</span>
        </div>
        <p className="text-sm leading-relaxed text-stone-700 italic">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <p className="mt-3 text-xs font-medium text-stone-500">
          — {testimonial.author}
        </p>
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
          <div className="text-center">
            <span className="text-2xl">🔒</span>
            <p className="mt-1 text-xs font-semibold text-stone-600">
              Pro Host members see full reviews
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShowcaseSection({
  providerName,
  category,
  rating,
  reviewCount,
  showcaseImages,
  testimonials,
  isSubscribed,
}: ShowcaseProps) {
  const theme = CATEGORY_THEME[category] || CATEGORY_THEME.cleaning;
  const visibleImages = showcaseImages.slice(0, VISIBLE_IMAGES);
  const hiddenImages = showcaseImages.slice(VISIBLE_IMAGES);
  const visibleReviews = testimonials.slice(0, VISIBLE_REVIEWS);
  const hiddenReviews = testimonials.slice(VISIBLE_REVIEWS);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Showcase</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Photos and reviews from {providerName}
          </p>
        </div>
        {!isSubscribed && (
          <Link
            href="/pricing#host-plans"
            className="rounded-full bg-pine-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-pine-900"
          >
            Unlock Full Showcase
          </Link>
        )}
      </div>

      {/* Photo Showcase */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {visibleImages.map((img, i) => (
          <ShowcaseCard
            key={`v-${i}`}
            image={img}
            theme={theme}
            index={i}
            blurred={false}
          />
        ))}
        {hiddenImages.map((img, i) => (
          <ShowcaseCard
            key={`h-${i}`}
            image={img}
            theme={theme}
            index={VISIBLE_IMAGES + i}
            blurred={!isSubscribed}
          />
        ))}
        {!isSubscribed && hiddenImages.length > 0 && (
          <Link
            href="/pricing#host-plans"
            className="flex min-w-[200px] flex-shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 text-center transition hover:border-pine-400 hover:bg-pine-50"
          >
            <div className="p-4">
              <span className="text-3xl">📸</span>
              <p className="mt-2 text-sm font-semibold text-stone-700">
                +{hiddenImages.length} more photos
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Unlock with Pro Host plan
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Reviews / Testimonials */}
      {testimonials.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Host Reviews
            </h3>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 ring-1 ring-amber-200">
              <span className="text-sm text-amber-500">★</span>
              <span className="text-xs font-bold text-stone-900">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-stone-500">
                ({reviewCount})
              </span>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {visibleReviews.map((t, i) => (
              <TestimonialCard key={`vr-${i}`} testimonial={t} blurred={false} />
            ))}
            {hiddenReviews.map((t, i) => (
              <TestimonialCard
                key={`hr-${i}`}
                testimonial={t}
                blurred={!isSubscribed}
              />
            ))}
          </div>
          {!isSubscribed && hiddenReviews.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/pricing#host-plans"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                🔒 See all {testimonials.length} reviews — Pro Host plan
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
