/**
 * Presentation tokens for the public dashboard (US-PUB-06).
 * Distinct from admin/collector chrome — aligned with NAC / PDM branding.
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

/** Tailwind accent stripes for stat cards (top border) */
export const PUBLIC_STAT_CARD_ACCENTS = [
  'border-t-brand',
  'border-t-nac-blue',
  'border-t-nac-orange',
  'border-t-brand',
] as const;

export const publicDashboardClasses = {
  page: 'mx-auto max-w-6xl space-y-10 xl:max-w-7xl',
  hero: [
    'relative overflow-hidden rounded-3xl border border-nac-blue/20',
    'bg-gradient-to-br from-nac-blue via-nac-blue-dark to-brand',
    'px-5 py-8 text-white shadow-md sm:px-8 sm:py-10',
  ].join(' '),
  heroEyebrow: 'text-xs font-bold uppercase tracking-widest text-nac-orange',
  heroTitle: 'mt-2 text-2xl font-bold leading-tight sm:text-3xl xl:text-4xl',
  heroLead: 'mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base',
  section: 'space-y-5',
  sectionHeading: 'flex items-center gap-2 text-lg font-bold text-text sm:text-xl',
  sectionHeadingIcon: 'h-5 w-5 shrink-0 text-brand',
  panel: [
    'rounded-2xl border border-border bg-surface',
    'shadow-sm transition-shadow hover:shadow-md',
  ].join(' '),
  panelInset: 'border-t border-border/60 bg-surface-muted/40 px-4 py-4 sm:px-5 sm:py-5',
  panelHeader: 'flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5',
  panelHeaderTitle: 'inline-flex min-h-11 flex-1 items-center gap-2 text-left text-sm font-bold text-text',
  statCard: [
    'rounded-2xl border border-border border-t-4 bg-surface p-5 shadow-sm',
    'transition hover:-translate-y-0.5 hover:shadow-md',
  ].join(' '),
  statCardTitle: 'text-xs font-semibold uppercase tracking-wide text-text-muted',
  statCardValue: 'mt-2 text-2xl font-bold tabular-nums text-text sm:text-3xl',
  exportButton: [
    'inline-flex min-h-11 min-w-36 items-center justify-center gap-2',
    'rounded-xl border border-border bg-surface px-4 py-2',
    'text-xs font-semibold text-text transition',
    'hover:border-brand/40 hover:bg-brand-light hover:text-brand',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'sm:text-sm',
  ].join(' '),
  chartPanel: 'rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6',
  chartPanelTitle: 'mb-4 flex items-center gap-2 text-sm font-semibold text-text',
  chartPanelAccent: 'h-4 w-1 shrink-0 rounded-full bg-brand',
  emptyChart: 'flex min-h-[16rem] items-center justify-center text-sm text-text-muted sm:min-h-[18rem]',
} as const;
