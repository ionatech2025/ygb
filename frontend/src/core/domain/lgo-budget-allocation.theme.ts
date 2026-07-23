import { publicDashboardClasses, publicResourcesClasses } from './public-dashboard.theme';

/** Presentation tokens for the LGO Budget Allocation collector module (US-LGOB-01). */
export const lgoBudgetAllocationClasses = {
  page: publicResourcesClasses.page,
  hero: publicResourcesClasses.hero,
  heroAccent: publicResourcesClasses.heroAccent,
  heroGlow: 'pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-nac-orange/15 blur-3xl',
  heroContent: publicResourcesClasses.heroContent,
  heroEyebrow: publicResourcesClasses.heroEyebrow,
  heroTitle: publicResourcesClasses.heroTitle,
  heroLead: publicResourcesClasses.heroLead,
  backLink: publicResourcesClasses.backLink,
  formPanel: [
    publicDashboardClasses.panel,
    'overflow-x-hidden p-6 sm:p-8',
  ].join(' '),
  formPanelAccent: 'pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nac-orange via-orange-400/80 to-amber-400/40',
  formShell: 'relative space-y-5',
  formPlaceholder: [
    'flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl',
    'border border-dashed border-border bg-surface-muted/60 px-4 py-8 text-center',
  ].join(' '),
  dashboardEntryCard: [
    'flex min-h-12 flex-row items-center gap-4 rounded-2xl border border-border',
    'bg-surface p-4 shadow-sm transition hover:border-brand/40 hover:bg-brand-light/20',
  ].join(' '),
  dashboardEntryIcon:
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nac-orange/10 text-nac-orange ring-1 ring-nac-orange/20',
  dashboardEntryTitle: 'text-sm font-bold text-text',
  dashboardEntrySummary: 'text-xs text-text-muted',
} as const;
