import type { BudgetPrioritySection } from './budget-priority-section.model';
import { publicDashboardClasses, publicResourcesClasses } from './public-dashboard.theme';

/** Per-sector accent tokens for cards, heroes, and form chrome. */
export const BUDGET_PRIORITY_SECTION_ACCENTS: Record<
  BudgetPrioritySection,
  { glow: string; icon: string; stripe: string }
> = {
  health: {
    glow: 'bg-brand/20',
    icon: 'bg-brand/10 text-brand ring-brand/20',
    stripe: 'from-brand via-brand/80 to-brand/40',
  },
  agriculture: {
    glow: 'bg-nac-orange/20',
    icon: 'bg-nac-orange/10 text-nac-orange ring-nac-orange/20',
    stripe: 'from-nac-orange via-orange-400/80 to-amber-400/40',
  },
  education: {
    glow: 'bg-nac-blue/20',
    icon: 'bg-nac-blue/10 text-nac-blue ring-nac-blue/20 dark:text-blue-300',
    stripe: 'from-nac-blue via-blue-500/80 to-indigo-400/40',
  },
  climate: {
    glow: 'bg-violet-500/20',
    icon: 'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-300',
    stripe: 'from-violet-600 via-violet-500/80 to-emerald-400/40',
  },
};

export const BUDGET_PRIORITY_DASHBOARD_PROMO_ACCENT = {
  glow: 'bg-nac-blue/20',
  icon: 'bg-nac-blue/10 text-nac-blue ring-nac-blue/20 dark:text-blue-300',
} as const;

/**
 * Presentation tokens for the Budget Priorities module (US-BP-01 / US-BP-02).
 * Extends public dashboard/resources patterns for a consistent open-data quality bar.
 */
export const budgetPrioritiesClasses = {
  page: publicResourcesClasses.page,
  hero: publicResourcesClasses.hero,
  heroAccent: publicResourcesClasses.heroAccent,
  heroGlow: publicResourcesClasses.heroGlow,
  heroContent: publicResourcesClasses.heroContent,
  heroEyebrow: publicResourcesClasses.heroEyebrow,
  heroTitle: publicResourcesClasses.heroTitle,
  heroLead: publicResourcesClasses.heroLead,
  heroBadges: publicDashboardClasses.heroBadges,
  heroBadge: publicDashboardClasses.heroBadge,
  backLink: publicResourcesClasses.backLink,
  sectionHeading: publicDashboardClasses.sectionHeading,
  sectionHeadingIcon: publicDashboardClasses.sectionHeadingIcon,
  sectorGrid: 'grid gap-5 md:grid-cols-2',
  sectorCard: publicResourcesClasses.resourceCard,
  sectorCardGlow: publicResourcesClasses.resourceCardGlow,
  sectorCardIcon: publicResourcesClasses.resourceCardIcon,
  sectorCardTitle: publicResourcesClasses.resourceCardTitle,
  sectorCardSummary: publicResourcesClasses.resourceCardSummary,
  sectorCardCta: publicResourcesClasses.resourceCardCta,
  dashboardPromoCard: [
    publicResourcesClasses.resourceCard,
    'flex min-h-[5.5rem] flex-row items-center gap-4 p-5 sm:p-6',
  ].join(' '),
  formPanel: [
    publicDashboardClasses.panel,
    'overflow-x-hidden p-6 sm:p-8',
  ].join(' '),
  formPanelAccent: 'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
  formShell: 'relative space-y-5',
  submitButton: [
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl',
    'bg-brand text-sm font-bold text-white transition hover:bg-brand-hover active:scale-[0.98]',
    'disabled:cursor-not-allowed disabled:bg-slate-400',
  ].join(' '),
  successPanel: [
    publicDashboardClasses.panel,
    'mt-4 space-y-6 p-6 sm:p-8',
  ].join(' '),
  successEyebrow: 'text-xs font-semibold uppercase tracking-wider text-text-muted',
  successTitle: 'text-xl font-bold text-text sm:text-2xl',
  successIconWrap:
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  successSectorLink: [
    'flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border',
    'bg-surface-muted px-4 py-3 text-sm font-semibold text-text transition',
    'hover:border-brand/40 hover:bg-brand-light/40',
  ].join(' '),
  successPrimaryAction: [
    'inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4',
    'text-sm font-bold text-white transition hover:bg-brand-hover',
  ].join(' '),
  successSecondaryAction: [
    'inline-flex min-h-11 items-center rounded-xl border border-border px-4',
    'text-sm font-semibold text-text transition hover:bg-surface-muted',
  ].join(' '),
  duplicateBlock: [
    'space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5',
    'text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100',
  ].join(' '),
  duplicateIconWrap:
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300',
  duplicateActionPrimary: [
    'inline-flex min-h-11 items-center rounded-xl border border-amber-300 bg-white px-4',
    'text-sm font-semibold text-amber-950 transition hover:bg-amber-100',
    'dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-900/40',
  ].join(' '),
  duplicateActionSecondary: [
    'inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold',
    'text-amber-900 underline-offset-2 hover:underline dark:text-amber-200',
  ].join(' '),
  errorAlert: [
    'flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5',
    'text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200',
  ].join(' '),
  dashboardPage: publicDashboardClasses.page,
  dashboardHero: publicDashboardClasses.hero,
  dashboardSection: publicDashboardClasses.section,
  dashboardPanel: publicDashboardClasses.panel,
} as const;

export function getBudgetPrioritySectionAccent(section: BudgetPrioritySection) {
  return BUDGET_PRIORITY_SECTION_ACCENTS[section];
}
