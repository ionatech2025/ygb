import { publicDashboardClasses, publicResourcesClasses } from './public-dashboard.theme';

/** LGO Budget Allocation module accent (collector + public dashboard). */
export const LGO_BUDGET_ALLOCATION_ACCENT = {
  glow: 'bg-nac-orange/20',
  icon: 'bg-nac-orange/10 text-nac-orange ring-nac-orange/20',
  stripe: 'from-nac-orange via-orange-400/80 to-amber-400/40',
} as const;

/**
 * Presentation tokens for the LGO Budget Allocation module (US-LGOB-01 / US-LGOB-02).
 * Extends public dashboard/resources patterns for collector form and public dashboard parity.
 */
export const lgoBudgetAllocationClasses = {
  page: publicResourcesClasses.page,
  hero: publicResourcesClasses.hero,
  heroAccent: publicResourcesClasses.heroAccent,
  heroGlow: 'pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-nac-orange/15 blur-3xl',
  heroContent: publicResourcesClasses.heroContent,
  heroEyebrow: publicResourcesClasses.heroEyebrow,
  heroTitle: publicResourcesClasses.heroTitle,
  heroLead: publicResourcesClasses.heroLead,
  heroIconWrap:
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nac-orange/10 text-nac-orange ring-1 ring-nac-orange/20 sm:h-12 sm:w-12',
  backLink: publicResourcesClasses.backLink,
  formPanel: [
    publicDashboardClasses.panel,
    'overflow-x-hidden p-6 sm:p-8',
  ].join(' '),
  formPanelAccent: `pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${LGO_BUDGET_ALLOCATION_ACCENT.stripe}`,
  formShell: 'relative space-y-5',
  formPlaceholder: [
    'flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl',
    'border border-dashed border-border bg-surface-muted/60 px-4 py-8 text-center',
  ].join(' '),
  sectorAllocationRow: [
    'grid grid-cols-1 gap-3 rounded-xl border border-border/80 bg-surface-muted/40 p-3',
    'sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-end',
  ].join(' '),
  sectorAllocationLabel: 'text-sm font-semibold text-text sm:py-2',
  textArea: 'min-h-[8rem] resize-y',
  submitButton: [
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl',
    'bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98]',
    'disabled:cursor-not-allowed disabled:bg-slate-400',
  ].join(' '),
  successBanner: [
    'flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5',
    'text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200',
  ].join(' '),
  errorAlert: [
    'rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900',
    'dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200',
  ].join(' '),
  dashboardEntryCard: [
    'flex min-h-12 flex-row items-center gap-4 rounded-2xl border border-border',
    'bg-surface p-4 shadow-sm transition hover:border-nac-orange/40 hover:bg-nac-orange/5',
  ].join(' '),
  dashboardEntryIcon:
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nac-orange/10 text-nac-orange ring-1 ring-nac-orange/20',
  dashboardEntryTitle: 'text-sm font-bold text-text',
  dashboardEntrySummary: 'text-xs leading-relaxed text-text-muted',
  dashboardEntryArrow: 'h-5 w-5 shrink-0 text-nac-orange',
  otherInterviewsHeading:
    'text-xs font-semibold uppercase tracking-wider text-text-muted',
  dashboardPage: publicDashboardClasses.page,
  dashboardHero: publicDashboardClasses.hero,
  dashboardSection: publicDashboardClasses.section,
  sectionHeading: publicDashboardClasses.sectionHeading,
  sectionHeadingIcon: publicDashboardClasses.sectionHeadingIcon,
  heroBadges: publicDashboardClasses.heroBadges,
  heroBadge: publicDashboardClasses.heroBadge,
} as const;
