import { describe, expect, it } from 'vitest';
import {
  BUDGET_PRIORITY_SECTIONS,
  getBudgetPrioritySection,
  isBudgetPrioritySection,
} from './budget-priority-section.model';

describe('budget-priority-section.model', () => {
  it('defines four sectors with SRS-aligned labels', () => {
    expect(BUDGET_PRIORITY_SECTIONS).toHaveLength(4);
    expect(BUDGET_PRIORITY_SECTIONS.map((section) => section.label)).toEqual([
      'Health Sector',
      'Agriculture Sector',
      'Education Sector',
      'Climate Change Mitigation & Adaptation',
    ]);
  });

  it('validates known section slugs', () => {
    expect(isBudgetPrioritySection('health')).toBe(true);
    expect(isBudgetPrioritySection('agriculture')).toBe(true);
    expect(isBudgetPrioritySection('education')).toBe(true);
    expect(isBudgetPrioritySection('climate')).toBe(true);
    expect(isBudgetPrioritySection('invalid')).toBe(false);
    expect(isBudgetPrioritySection(undefined)).toBe(false);
  });

  it('returns section metadata for valid slugs', () => {
    expect(getBudgetPrioritySection('health')?.shortLabel).toBe('Health');
    expect(getBudgetPrioritySection('unknown')).toBeUndefined();
  });
});
