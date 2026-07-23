import { describe, expect, it } from 'vitest';
import {
  BUDGET_PRIORITY_SECTION_ACCENTS,
  budgetPrioritiesClasses,
} from './budget-priorities.theme';

describe('budget-priorities.theme', () => {
  it('exports non-empty class bundles for hero, sector card, and form panel', () => {
    expect(budgetPrioritiesClasses.hero.length).toBeGreaterThan(0);
    expect(budgetPrioritiesClasses.hero).toMatch(/rounded-2xl/);
    expect(budgetPrioritiesClasses.sectorCard.length).toBeGreaterThan(0);
    expect(budgetPrioritiesClasses.sectorCard).toMatch(/rounded-2xl/);
    expect(budgetPrioritiesClasses.formPanel.length).toBeGreaterThan(0);
    expect(budgetPrioritiesClasses.formPanel).toMatch(/rounded-2xl/);
  });

  it('defines distinct accent styles for all four sectors', () => {
    const accents = Object.values(BUDGET_PRIORITY_SECTION_ACCENTS);
    expect(accents).toHaveLength(4);
    expect(new Set(accents.map((accent) => accent.icon)).size).toBe(4);
    expect(accents.every((accent) => accent.glow.includes('bg-'))).toBe(true);
  });

  it('uses minimum tap target heights on primary actions', () => {
    expect(budgetPrioritiesClasses.submitButton).toMatch(/min-h-11/);
    expect(budgetPrioritiesClasses.successPrimaryAction).toMatch(/min-h-11/);
    expect(budgetPrioritiesClasses.duplicateActionPrimary).toMatch(/min-h-11/);
  });
});
