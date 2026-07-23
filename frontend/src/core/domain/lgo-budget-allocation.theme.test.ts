import { describe, expect, it } from 'vitest';
import {
  LGO_BUDGET_ALLOCATION_ACCENT,
  lgoBudgetAllocationClasses,
} from './lgo-budget-allocation.theme';

describe('lgo-budget-allocation.theme', () => {
  it('exports non-empty class bundles for form panel and dashboard hero', () => {
    expect(lgoBudgetAllocationClasses.formPanel.length).toBeGreaterThan(0);
    expect(lgoBudgetAllocationClasses.formPanel).toMatch(/rounded-2xl/);
    expect(lgoBudgetAllocationClasses.dashboardHero.length).toBeGreaterThan(0);
    expect(lgoBudgetAllocationClasses.dashboardHero).toMatch(/rounded-2xl/);
    expect(lgoBudgetAllocationClasses.hero.length).toBeGreaterThan(0);
    expect(lgoBudgetAllocationClasses.hero).toMatch(/rounded-2xl/);
  });

  it('defines LGO accent styles for collector and dashboard chrome', () => {
    expect(LGO_BUDGET_ALLOCATION_ACCENT.glow).toMatch(/bg-/);
    expect(LGO_BUDGET_ALLOCATION_ACCENT.icon).toMatch(/text-nac-orange/);
    expect(LGO_BUDGET_ALLOCATION_ACCENT.stripe).toMatch(/from-nac-orange/);
  });

  it('uses minimum tap target heights on primary actions', () => {
    expect(lgoBudgetAllocationClasses.submitButton).toMatch(/min-h-11/);
    expect(lgoBudgetAllocationClasses.dashboardEntryCard).toMatch(/min-h-12/);
  });
});
