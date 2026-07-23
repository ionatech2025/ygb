import { describe, expect, it } from 'vitest';
import {
  BUDGET_PRIORITY_FORM_CONFIG,
  getBudgetPriorityFormConfig,
} from './budget-priority-form-config';
import { BUDGET_PRIORITY_SECTIONS } from './budget-priority-section.model';

describe('budget-priority-form-config', () => {
  it('defines distinct priority area options for all four sections', () => {
    expect(BUDGET_PRIORITY_SECTIONS).toHaveLength(4);

    const optionSets = BUDGET_PRIORITY_SECTIONS.map((section) =>
      getBudgetPriorityFormConfig(section.id).priorityAreas.map((option) => option.value)
    );

    optionSets.forEach((options) => {
      expect(options.length).toBeGreaterThan(0);
    });

    const uniqueSets = new Set(optionSets.map((options) => options.join('|')));
    expect(uniqueSets.size).toBe(4);
  });

  it('returns section-specific config entries', () => {
    expect(BUDGET_PRIORITY_FORM_CONFIG.health.priorityAreas[0]?.value).toBe('PRIMARY_HEALTH_CARE');
    expect(BUDGET_PRIORITY_FORM_CONFIG.agriculture.priorityAreas[0]?.value).toBe('IRRIGATION');
    expect(BUDGET_PRIORITY_FORM_CONFIG.education.priorityAreas[0]?.value).toBe('PRIMARY_EDUCATION');
    expect(BUDGET_PRIORITY_FORM_CONFIG.climate.priorityAreas[0]?.value).toBe('REFORESTATION');
  });
});
