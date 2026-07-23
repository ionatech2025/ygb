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
  shell: 'relative min-h-dvh bg-surface-muted',
  ambientGlowLeft: 'absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl dark:bg-brand/5',
  ambientGlowRight: 'absolute bottom-0 right-0 h-80 w-80 rounded-full bg-nac-orange/10 blur-3xl dark:bg-nac-orange/5',
  brandPanel: [
    'relative order-1 flex flex-col overflow-hidden',
    'bg-gradient-to-br from-nac-blue via-nac-blue-dark to-slate-950',
    'px-5 py-10 text-white lg:min-h-dvh lg:flex-1 lg:justify-between lg:px-12 lg:py-14',
  ].join(' '),
  brandGrid:
    'pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]',
  brandRadial: 'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]',
  featureCard:
    'flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10',
  formPanel: 'order-2 flex scroll-mt-4 items-center justify-center px-4 py-8 lg:min-h-dvh lg:flex-1 lg:px-10',
  formCard: [
    'rounded-2xl border border-border/80 bg-surface p-6 shadow-sm ring-1 ring-black/[0.03]',
    'sm:p-8 dark:ring-white/[0.04]',
  ].join(' '),
  submitButton:
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-nac-orange text-sm font-bold text-white shadow-sm shadow-nac-orange/20 transition hover:bg-nac-orange-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted disabled:shadow-none',
  testAccountCard: 'rounded-xl border border-border/80 bg-surface-muted/60 px-3 py-2.5 text-center',
  publicLink:
    'inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-hover',
} as const;
