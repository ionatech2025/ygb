import { ApiError } from './api/api-client';
import type { BudgetPrioritySection } from './domain/budget-priority-section.model';
import { getBudgetPrioritySection } from './domain/budget-priority-section.model';
import { formatFinancialYearPeriodLabel } from './financial-year-period';
import { financialYearPeriodFromKey } from './respondent-uniqueness.validation';

export type BudgetPrioritySubmitErrorKind = 'duplicate' | 'validation' | 'network' | 'unknown';

export interface MappedBudgetPriorityError {
  kind: BudgetPrioritySubmitErrorKind;
  title: string;
  message: string;
}

export function formatBudgetPriorityFinancialYearLabel(financialYearPeriodKey: string): string {
  return formatFinancialYearPeriodLabel(financialYearPeriodFromKey(financialYearPeriodKey));
}

export function buildDuplicateBudgetPriorityMessage(
  section: BudgetPrioritySection,
  financialYearPeriodKey?: string
): string {
  const sectionMeta = getBudgetPrioritySection(section);
  const sectionLabel = sectionMeta?.shortLabel ?? section;
  const periodLabel = financialYearPeriodKey
    ? formatBudgetPriorityFinancialYearLabel(financialYearPeriodKey)
    : 'this financial year period';

  return `You have already submitted ${sectionLabel} budget priorities for ${periodLabel}. Only one submission per sector is allowed each financial year. You may still submit priorities for other sectors.`;
}

export function mapBudgetPrioritySubmitError(
  error: unknown,
  section: BudgetPrioritySection,
  options: { financialYearPeriodKey?: string } = {}
): MappedBudgetPriorityError {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return {
        kind: 'duplicate',
        title: 'Already submitted',
        message: buildDuplicateBudgetPriorityMessage(section, options.financialYearPeriodKey),
      };
    }

    if (error.status === 400) {
      return {
        kind: 'validation',
        title: 'Check your answers',
        message: error.message || 'Some answers were invalid. Review the form and try again.',
      };
    }

    return {
      kind: 'network',
      title: 'Submission failed',
      message: error.message || 'Unable to submit right now. Check your connection and try again.',
    };
  }

  return {
    kind: 'unknown',
    title: 'Submission failed',
    message: 'Something went wrong. Please try again.',
  };
}
