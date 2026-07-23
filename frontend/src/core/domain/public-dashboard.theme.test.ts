import { describe, expect, it } from 'vitest';
import {
  PUBLIC_CHART_COLORS,
  PUBLIC_CHART_PALETTE,
  PUBLIC_STAT_CARD_ACCENTS,
  publicDashboardClasses,
} from './public-dashboard.theme';

describe('public-dashboard.theme', () => {
  it('defines NAC-aligned chart palette with brand, blue, and orange', () => {
    expect(PUBLIC_CHART_PALETTE).toContain(PUBLIC_CHART_COLORS.brand);
    expect(PUBLIC_CHART_PALETTE).toContain(PUBLIC_CHART_COLORS.nacBlue);
    expect(PUBLIC_CHART_PALETTE).toContain(PUBLIC_CHART_COLORS.nacOrange);
    expect(PUBLIC_CHART_PALETTE.length).toBeGreaterThanOrEqual(4);
  });

  it('exposes reusable presentation class bundles', () => {
    expect(publicDashboardClasses.hero).toMatch(/rounded-2xl/);
    expect(publicDashboardClasses.statCard).toMatch(/rounded-2xl/);
    expect(publicDashboardClasses.exportButton).toMatch(/min-h-11/);
  });

  it('cycles stat card accent styles', () => {
    expect(PUBLIC_STAT_CARD_ACCENTS.length).toBeGreaterThanOrEqual(3);
    expect(PUBLIC_STAT_CARD_ACCENTS[0]?.icon).toMatch(/bg-brand/);
  });
});
