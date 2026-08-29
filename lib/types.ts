export type Category =
  | "cleaning"
  | "hottub"
  | "maintenance"
  | "hvac"
  | "pest"
  | "plumbing"
  | "electrical"
  | "landscaping"
  | "snow-removal"
  | "linens"
  | "photography"
  | "suppliers"
  | "trash";

export type County = "Monroe" | "Pike" | "Carbon" | "Wayne";

export type ProviderTier = "free" | "standard" | "premium" | "featured";

export interface Provider {
  slug: string;
  name: string;
  category: Category;
  counties: County[];
  serviceAreas: string[];
  tier: ProviderTier;
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  tagline: string;
  description: string;
  services: string[];
  responseTime: string;
  insured: boolean;
  licensed: boolean;
  yearFounded: number;
  priceNote?: string;
  pricingNotes?: string;
  featuredResorts?: string[];
}

export interface CategoryMeta {
  slug: Category;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  typicalCost: string;
}
