/** Budget Priorities sector slugs (SRS §4.7.1). */
export type BudgetPrioritySection = 'health' | 'agriculture' | 'education' | 'climate';

export interface BudgetPrioritySectionMeta {
  id: BudgetPrioritySection;
  label: string;
  shortLabel: string;
  description: string;
}

export const BUDGET_PRIORITY_SECTIONS: readonly BudgetPrioritySectionMeta[] = [
  {
    id: 'health',
    label: 'Health Sector',
    shortLabel: 'Health',
    description: 'Share your priority areas for health budget allocation.',
  },
  {
    id: 'agriculture',
    label: 'Agriculture Sector',
    shortLabel: 'Agriculture',
    description: 'Share your priority areas for agriculture budget allocation.',
  },
  {
    id: 'education',
    label: 'Education Sector',
    shortLabel: 'Education',
    description: 'Share your priority areas for education budget allocation.',
  },
  {
    id: 'climate',
    label: 'Climate Change Mitigation & Adaptation',
    shortLabel: 'Climate',
    description: 'Share your priority areas for climate-related budget allocation.',
  },
] as const;

export function isBudgetPrioritySection(value: string | undefined): value is BudgetPrioritySection {
  if (!value) {
    return false;
  }
  return BUDGET_PRIORITY_SECTIONS.some((section) => section.id === value);
}

export function getBudgetPrioritySection(
  value: string | undefined
): BudgetPrioritySectionMeta | undefined {
  if (!isBudgetPrioritySection(value)) {
    return undefined;
  }
  return BUDGET_PRIORITY_SECTIONS.find((section) => section.id === value);
}
