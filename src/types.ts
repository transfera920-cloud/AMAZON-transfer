export interface BrandInfo {
  name: string;
  phone: string;
  email: string;
  lineUrl: string;
  quoteUrl: string;
}

export interface HeroContent {
  h1: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  bgImageUrl?: string;
}

export interface RouteItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  enabled: boolean;
  sort: number;
  quoteUrl: string;
}

export interface ChildContent {
  id: string;
  name: string;
  description: string;
  phone: string;
  url: string;
  line: string;
  enabled: boolean;
  sort: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sort: number;
  displayMode?: string;
  url?: string;
  contents: ChildContent[];
}

export interface BookingStep {
  step: number;
  title: string;
  description: string;
}

export interface FleetAdvantage {
  id: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'Luggage' | 'Users' | 'BadgeDollarSign';
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
}

export interface CmsData {
  brand: BrandInfo;
  hero: HeroContent;
  routes: RouteItem[];
  services: ServiceItem[];
  bookingSteps: BookingStep[];
  fleetAdvantages: FleetAdvantage[];
  seo: SeoSettings;
  lastUpdated: string;
  version: number;
}

export interface PublicCmsData {
  brand: BrandInfo;
  hero: HeroContent;
  routes: RouteItem[];
  services: ServiceItem[];
  bookingSteps: BookingStep[];
  fleetAdvantages: FleetAdvantage[];
  seo: SeoSettings;
  lastUpdated: string;
}

export interface SystemStatus {
  status: 'ok' | 'degraded';
  routesCount: number;
  servicesCount: number;
  childContentsCount: number;
  lastUpdated: string;
  serverTime: string;
  uptimeSeconds: number;
  storageType: string;
}
