import type { BudgetPrioritySection } from './budget-priority-section.model';

export interface BudgetPriorityAreaOption {
  value: string;
  label: string;
}

export interface BudgetPrioritySectionFormConfig {
  priorityAreas: BudgetPriorityAreaOption[];
}

export const BUDGET_PRIORITY_FORM_CONFIG: Record<BudgetPrioritySection, BudgetPrioritySectionFormConfig> = {
  health: {
    priorityAreas: [
      { value: 'PRIMARY_HEALTH_CARE', label: 'Primary health care' },
      { value: 'MATERNAL_HEALTH', label: 'Maternal and child health' },
      { value: 'HOSPITAL_SERVICES', label: 'Hospital and referral services' },
      { value: 'COMMUNITY_HEALTH', label: 'Community health outreach' },
    ],
  },
  agriculture: {
    priorityAreas: [
      { value: 'IRRIGATION', label: 'Irrigation and water for production' },
      { value: 'SEEDS_INPUTS', label: 'Seeds and agricultural inputs' },
      { value: 'EXTENSION_SERVICES', label: 'Extension and farmer training' },
      { value: 'MARKET_ACCESS', label: 'Market access and storage' },
    ],
  },
  education: {
    priorityAreas: [
      { value: 'PRIMARY_EDUCATION', label: 'Primary education infrastructure' },
      { value: 'SECONDARY_EDUCATION', label: 'Secondary education access' },
      { value: 'TEACHER_SUPPORT', label: 'Teacher recruitment and support' },
      { value: 'SKILLS_TRAINING', label: 'Skills and vocational training' },
    ],
  },
  climate: {
    priorityAreas: [
      { value: 'REFORESTATION', label: 'Reforestation and tree planting' },
      { value: 'WATER_CONSERVATION', label: 'Water conservation' },
      { value: 'RENEWABLE_ENERGY', label: 'Renewable and clean energy' },
      { value: 'DISASTER_PREPAREDNESS', label: 'Disaster preparedness' },
    ],
  },
};

export function getBudgetPriorityFormConfig(section: BudgetPrioritySection): BudgetPrioritySectionFormConfig {
  return BUDGET_PRIORITY_FORM_CONFIG[section];
}

const ALL_PRIORITY_AREA_LABELS = Object.fromEntries(
  Object.values(BUDGET_PRIORITY_FORM_CONFIG).flatMap((config) =>
    config.priorityAreas.map((option) => [option.value, option.label])
  )
);

export function getBudgetPriorityAreaLabel(code: string): string {
  return ALL_PRIORITY_AREA_LABELS[code] ?? code.replaceAll('_', ' ').toLowerCase();
}
