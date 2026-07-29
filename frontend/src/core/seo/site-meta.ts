export const SITE_NAME = 'Youth Go Budget App';
export const SITE_ORIGIN = import.meta.env.VITE_APP_ORIGIN ?? 'https://youthgobudgetapp.org';
export const DEFAULT_DESCRIPTION =
  'Explore anonymised Parish Development Model data, community budget priorities, and LGO allocations across Uganda. Built for transparency, youth participation, and programme accountability.';
export const DEFAULT_OG_IMAGE = '/pwa-512.png';

export interface PageMetaDefinition {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
}

export const PAGE_META = {
  login: {
    title: 'Staff Sign In',
    description: 'Sign in to the Youth Go Budget App staff portal for administrators and field data collectors.',
    canonicalPath: '/login',
    noIndex: true,
  },
  publicDashboard: {
    title: 'Public PDM Dashboard',
    description:
      'Explore anonymised Parish Development Model survey data across districts, parishes, and programme filters.',
    canonicalPath: '/dashboard',
  },
  budgetPrioritiesHub: {
    title: 'Community Budget Priorities',
    description: 'Share your priority areas for sector budget allocation through the Youth Go Budget App.',
    canonicalPath: '/budget-priorities',
  },
  budgetPrioritiesDashboard: {
    title: 'Budget Priorities Dashboard',
    description: 'View anonymised community budget priority submissions by sector, location, and demographics.',
    canonicalPath: '/dashboard/budget-priorities',
  },
  lgoBudgetDashboard: {
    title: 'LGO Budget Allocations Dashboard',
    description: 'Explore local government budget allocation submissions and anonymised programme insights.',
    canonicalPath: '/dashboard/lgo-budget-allocation',
  },
  resources: {
    title: 'PDM Resources',
    description: 'Official Parish Development Model resources, guides, and reference documents for Uganda.',
    canonicalPath: '/resources',
  },
} as const satisfies Record<string, PageMetaDefinition>;

export const PUBLIC_SITEMAP_PATHS = [
  '/dashboard',
  '/dashboard/budget-priorities',
  '/dashboard/lgo-budget-allocation',
  '/budget-priorities',
  '/resources',
] as const;

export function buildAbsoluteUrl(path: string): string {
  return `${SITE_ORIGIN.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildWebApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    applicationCategory: 'GovernmentApplication',
    operatingSystem: 'Web',
    url: buildAbsoluteUrl('/dashboard'),
    description: DEFAULT_DESCRIPTION,
  };
}
