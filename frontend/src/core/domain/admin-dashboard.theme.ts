/** Presentation tokens for admin portal and staff login. */

export const ADMIN_STAT_CARD_ACCENTS = [
  { ring: 'ring-brand/15', icon: 'bg-brand/10 text-brand' },
  { ring: 'ring-nac-blue/15', icon: 'bg-nac-blue/10 text-nac-blue dark:text-blue-300' },
  { ring: 'ring-nac-orange/15', icon: 'bg-nac-orange/10 text-nac-orange' },
  { ring: 'ring-violet-500/15', icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  { ring: 'ring-sky-500/15', icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' },
] as const;

export const adminDashboardClasses = {
  page: 'mx-auto max-w-6xl space-y-8 xl:max-w-7xl',
  hero: [
    'relative overflow-hidden rounded-2xl border border-border/80 bg-surface',
    'p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8',
    'dark:ring-white/[0.04]',
  ].join(' '),
  heroAccent: 'pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-nac-blue via-brand to-nac-orange',
  heroGlow:
    'pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-nac-blue/10 blur-3xl dark:bg-nac-blue/5',
  heroContent: 'relative z-10 pl-3 sm:pl-4',
  heroEyebrow:
    'inline-flex items-center rounded-full border border-nac-blue/20 bg-nac-blue/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-nac-blue dark:text-blue-300',
  heroTitle: 'mt-3 text-2xl font-semibold tracking-tight text-text sm:text-3xl',
  heroLead: 'mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]',
  section: 'space-y-4',
  sectionHeading:
    'flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted sm:text-[0.8125rem]',
  sectionHeadingIcon: 'h-4 w-4 shrink-0 text-brand',
  panel: [
    'overflow-hidden rounded-2xl border border-border/80 bg-surface',
    'shadow-sm ring-1 ring-black/[0.03] transition-shadow',
    'hover:shadow-md dark:ring-white/[0.04]',
  ].join(' '),
  panelInset: 'border-t border-border/60 bg-surface-muted/30 px-4 py-5 sm:px-6',
  panelHeader:
    'flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5',
  panelHeaderTitle:
    'inline-flex min-h-11 flex-1 items-center gap-2.5 text-left text-sm font-semibold text-text',
  panelBody: 'space-y-5 px-4 py-5 sm:px-6',
  statCard: [
    'relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-5',
    'shadow-sm ring-1 transition duration-200',
    'hover:-translate-y-0.5 hover:shadow-md',
  ].join(' '),
  statCardTitle: 'text-xs font-medium uppercase tracking-wide text-text-muted',
  statCardValue: 'mt-2 text-3xl font-semibold tabular-nums tracking-tight text-text',
  statCardIcon: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
  chartPanel: [
    'rounded-2xl border border-border/80 bg-surface p-5 shadow-sm ring-1 ring-black/[0.03]',
    'sm:p-6 dark:ring-white/[0.04]',
  ].join(' '),
  chartPanelTitle: 'mb-4 flex items-center gap-2.5 text-sm font-semibold text-text',
  chartPanelAccent: 'h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-nac-blue to-brand',
  exportToolbar: [
    'rounded-2xl border border-border/80 bg-surface p-4 shadow-sm ring-1 ring-black/[0.03]',
    'sm:p-5 dark:ring-white/[0.04]',
  ].join(' '),
  exportButton: [
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2',
    'text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
  ].join(' '),
  exportButtonPrimary: 'bg-brand text-white shadow-sm hover:bg-brand-hover',
  exportButtonSecondary:
    'border border-border bg-surface text-text hover:border-brand/30 hover:bg-brand-light/50 hover:text-brand',
  exportButtonNeutral:
    'border border-border bg-surface-muted/50 text-text hover:border-nac-blue/30 hover:bg-nac-blue/5 hover:text-nac-blue dark:hover:text-blue-300',
  pageHeaderTitle: 'text-2xl font-semibold tracking-tight text-text sm:text-3xl',
  pageHeaderLead: 'mt-2 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]',
  contentCard: [
    'rounded-2xl border border-border/80 bg-surface p-4 shadow-sm ring-1 ring-black/[0.03]',
    'sm:p-6 dark:ring-white/[0.04]',
  ].join(' '),
  contentCardHeader: 'mb-4 space-y-1 border-b border-border/60 pb-4',
  contentCardTitle: 'text-sm font-semibold text-text',
  contentCardSubtitle: 'text-xs text-text-muted',
} as const;

export const loginPortalClasses = {
  shell: 'relative min-h-dvh bg-surface-muted overflow-hidden selection:bg-brand/20 selection:text-brand',
  ambientGlowLeft: 'pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px] dark:bg-brand/15',
  ambientGlowRight: 'pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-nac-orange/10 blur-[120px] dark:bg-nac-orange/15',
  ambientGlowCenter: 'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-nac-blue/5 blur-[140px] dark:bg-nac-blue/10',
  brandPanel: [
    'relative order-1 flex flex-col justify-between overflow-hidden bg-surface/70 backdrop-blur-xl',
    'border-b border-border/80 px-6 py-10 lg:min-h-dvh lg:flex-1 lg:border-b-0 lg:border-r lg:px-12 lg:py-14',
  ].join(' '),
  brandAccent: 'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nac-blue via-brand to-nac-orange',
  brandEyebrow: 'text-[11px] font-bold uppercase tracking-widest text-nac-orange',
  brandSubtitle: 'text-[10px] font-semibold uppercase tracking-widest text-text-muted',
  brandMonogram:
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand via-nac-orange to-nac-blue text-base font-black tracking-wider text-white shadow-lg shadow-brand/25 ring-1 ring-white/20 transition-transform duration-300 hover:scale-105',
  officialBadge:
    'inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-light/60 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand backdrop-blur-md dark:bg-brand/15 dark:border-brand/30',
  headline: 'text-2xl font-black leading-tight tracking-tight text-text sm:text-3xl lg:text-4xl',
  lead: 'max-w-lg text-sm leading-relaxed text-text-muted sm:text-base',
  featureCard: [
    'group flex gap-3.5 rounded-2xl border border-border/80 bg-surface/80 p-4 shadow-xs ring-1 ring-black/[0.02]',
    'transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:bg-surface hover:shadow-md dark:ring-white/[0.04]',
  ].join(' '),
  featureIcon:
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light to-brand/10 text-brand shadow-xs transition-transform duration-300 group-hover:scale-110 dark:from-brand/20 dark:to-brand/5 dark:text-brand',
  featureTitle: 'text-sm font-bold text-text group-hover:text-brand transition-colors',
  featureDetail: 'mt-0.5 text-xs leading-relaxed text-text-muted',
  footerCopy: 'text-xs font-medium text-text-muted/80',
  formPanel: 'order-2 flex scroll-mt-4 items-center justify-center px-4 py-10 lg:min-h-dvh lg:flex-1 lg:px-12',
  formCard: [
    'w-full rounded-3xl border border-border/80 bg-surface/90 p-6 shadow-xl backdrop-blur-xl ring-1 ring-black/[0.04]',
    'sm:p-9 dark:ring-white/[0.06] dark:bg-surface/80',
  ].join(' '),
  submitButton:
    'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-nac-orange to-brand px-6 text-sm font-bold text-white shadow-md shadow-nac-orange/20 transition-all duration-200 hover:opacity-95 hover:shadow-lg hover:shadow-nac-orange/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
  testAccountCard: 'group rounded-xl border border-border/80 bg-surface-muted/50 p-2.5 text-left transition duration-200 hover:border-brand/30 hover:bg-surface-muted',
  publicLink:
    'inline-flex min-h-10 items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted transition-colors hover:text-brand',
  mobileSignInButton:
    'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-xs font-bold text-text shadow-xs transition hover:bg-surface-muted lg:hidden',
} as const;
