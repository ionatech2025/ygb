/**
 * Presentation tokens for the public dashboard (US-PUB-06).
 * Modern open-data / analytics layout — distinct from admin/collector chrome.
 */

/** ECharts palette: brand green, NAC blue, NAC orange, slate, violet accent */
export const PUBLIC_CHART_PALETTE = [
  '#359966',
  '#19376d',
  '#f97316',
  '#64748b',
  '#8b5cf6',
] as const;

export const PUBLIC_CHART_COLORS = {
  brand: PUBLIC_CHART_PALETTE[0],
  nacBlue: PUBLIC_CHART_PALETTE[1],
  nacOrange: PUBLIC_CHART_PALETTE[2],
  muted: PUBLIC_CHART_PALETTE[3],
  accent: PUBLIC_CHART_PALETTE[4],
} as const;

export const PUBLIC_CHART_AXIS = {
  label: PUBLIC_CHART_COLORS.muted,
  grid: '#e2e8f0',
} as const;

export const PUBLIC_STAT_CARD_ACCENTS = [
  { ring: 'ring-brand/15', icon: 'bg-brand/10 text-brand' },
  { ring: 'ring-nac-blue/15', icon: 'bg-nac-blue/10 text-nac-blue dark:text-blue-300' },
  { ring: 'ring-nac-orange/15', icon: 'bg-nac-orange/10 text-nac-orange' },
  { ring: 'ring-violet-500/15', icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
] as const;

/** Analytics dashboards need slightly more room for charts and filter grids. */
export const PUBLIC_DASHBOARD_MAX_WIDTH = 'max-w-5xl';

/** Participation and reading pages (forms, resources, success states). */
export const PUBLIC_CONTENT_MAX_WIDTH = 'max-w-4xl';

export const publicLayoutClasses = {
  shell: [
    'mx-auto flex w-full items-center justify-between gap-3',
    PUBLIC_DASHBOARD_MAX_WIDTH,
    'px-4 py-3 sm:px-6',
  ].join(' '),
  main: 'flex-1 px-4 py-8 sm:px-6 sm:py-10',
  footerShell: ['mx-auto w-full', PUBLIC_CONTENT_MAX_WIDTH, 'px-4 sm:px-6'].join(' '),
  footerCopy: 'mx-auto max-w-md text-center',
} as const;

export const publicDashboardClasses = {
  page: `mx-auto w-full ${PUBLIC_DASHBOARD_MAX_WIDTH} space-y-8`,
  hero: [
    'relative overflow-hidden rounded-2xl border border-border/80 bg-surface',
    'p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8',
    'dark:ring-white/[0.04]',
  ].join(' '),
  heroAccent: 'pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand via-nac-blue to-nac-orange',
  heroGlow:
    'pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl dark:bg-brand/5',
  heroContent: 'relative z-10 pl-3 sm:pl-4',
  heroEyebrow:
    'inline-flex items-center rounded-full border border-brand/20 bg-brand-light px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand',
  heroTitle: 'mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl xl:text-[2rem] xl:leading-tight',
  heroLead: 'mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]',
  heroBadges: 'mt-4 flex flex-wrap gap-2',
  heroBadge:
    'inline-flex items-center rounded-full border border-border bg-surface-muted/80 px-2.5 py-1 text-[11px] font-medium text-text-muted',
  section: 'space-y-4',
  sectionHeading:
    'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted sm:text-[0.8125rem]',
  sectionHeadingIcon: 'h-4 w-4 shrink-0 text-brand',
  panel: [
    'rounded-2xl border border-border/80 bg-surface',
    'shadow-sm ring-1 ring-black/[0.03] transition-shadow',
    'hover:shadow-md dark:ring-white/[0.04]',
  ].join(' '),
  panelInset: 'border-t border-border/60 bg-surface-muted/30 px-4 py-5 sm:px-6',
  panelHeader:
    'flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5',
  panelHeaderTitle:
    'inline-flex min-h-11 flex-1 items-center gap-2.5 text-left text-sm font-semibold text-text',
  statCard: [
    'relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-5',
    'shadow-sm ring-1 transition duration-200',
    'hover:-translate-y-0.5 hover:shadow-md',
  ].join(' '),
  statCardTitle: 'text-xs font-medium uppercase tracking-wide text-text-muted',
  statCardValue: 'mt-2 text-3xl font-semibold tabular-nums tracking-tight text-text',
  statCardIcon: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
  exportButton: [
    'inline-flex min-h-11 items-center justify-center gap-2',
    'rounded-xl px-4 py-2 text-sm font-semibold transition',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' '),
  exportButtonPrimary: 'bg-brand text-white shadow-sm hover:bg-brand-hover',
  exportButtonSecondary:
    'border border-border bg-surface text-text hover:border-brand/30 hover:bg-brand-light/50 hover:text-brand',
  chartPanel: [
    'rounded-2xl border border-border/80 bg-surface p-5 shadow-sm ring-1 ring-black/[0.03]',
    'sm:p-6 dark:ring-white/[0.04]',
  ].join(' '),
  chartPanelTitle: 'mb-4 flex items-center gap-2.5 text-sm font-semibold text-text',
  chartPanelAccent: 'h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-brand to-nac-blue',
  emptyChart: 'flex min-h-[16rem] items-center justify-center text-sm text-text-muted sm:min-h-[18rem]',
} as const;

/** Shared presentation tokens for public Resources pages (US-DASH-09). */
export const publicResourcesClasses = {
  page: `mx-auto w-full ${PUBLIC_CONTENT_MAX_WIDTH} space-y-8`,
  hero: publicDashboardClasses.hero,
  heroAccent: publicDashboardClasses.heroAccent,
  heroGlow: publicDashboardClasses.heroGlow,
  heroContent: publicDashboardClasses.heroContent,
  heroEyebrow: publicDashboardClasses.heroEyebrow,
  heroTitle: publicDashboardClasses.heroTitle,
  heroLead: publicDashboardClasses.heroLead,
  resourceGrid: 'grid gap-5 sm:grid-cols-2',
  resourceCard: [
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface p-6',
    'shadow-sm ring-1 ring-black/[0.03] transition duration-200',
    'hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-md dark:ring-white/[0.04]',
  ].join(' '),
  resourceCardGlow:
    'pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100',
  resourceCardIcon: 'flex h-11 w-11 items-center justify-center rounded-xl',
  resourceCardTitle: 'mt-4 text-lg font-semibold tracking-tight text-text',
  resourceCardSummary: 'mt-2 flex-1 text-sm leading-relaxed text-text-muted',
  resourceCardCta:
    'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5',
  detailLayout: 'flex flex-col gap-8 lg:flex-row lg:items-start',
  article: [
    'min-w-0 flex-1 rounded-2xl border border-border/80 bg-surface',
    'p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8 lg:p-10 dark:ring-white/[0.04]',
  ].join(' '),
  articleHeader: 'border-b border-border/60 pb-6',
  backLink:
    'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-brand transition hover:bg-brand-light/50 hover:text-brand-hover',
  articleTitle: 'mt-4 text-2xl font-semibold tracking-tight text-text sm:text-3xl',
  articleSummary: 'mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]',
  articleBody: 'mt-8 max-w-3xl',
  tocNav: [
    'sticky top-24 rounded-2xl border border-border/80 bg-surface/95 p-5',
    'shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm lg:w-72 dark:ring-white/[0.04]',
  ].join(' '),
  tocHeading: 'text-xs font-semibold uppercase tracking-wider text-text-muted',
  tocLink:
    'block rounded-lg px-2.5 py-2 text-sm text-text-muted transition hover:bg-surface-muted hover:text-text',
  tocLinkActive: 'bg-brand-light/60 font-medium text-brand dark:bg-brand/15',
} as const;

export const PUBLIC_RESOURCE_CARD_ACCENTS = [
  { glow: 'bg-brand/20', icon: 'bg-brand/10 text-brand ring-brand/20' },
  { glow: 'bg-nac-blue/20', icon: 'bg-nac-blue/10 text-nac-blue ring-nac-blue/20 dark:text-blue-300' },
  { glow: 'bg-nac-orange/20', icon: 'bg-nac-orange/10 text-nac-orange ring-nac-orange/20' },
] as const;
