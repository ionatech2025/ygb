import type { FormType } from './domain/form-type.model';
import type { FinancialYearPeriod, FinancialYearPeriodHalf } from './domain/financial-year-period.model';
import type { IRespondentUniquenessPort } from '../ports/respondent-uniqueness.port';
import { respondentUniqueness } from '../adapters/secondary/submission/respondent-uniqueness.adapter';
import {
  deriveFinancialYearPeriod,
  formatFinancialYearPeriodLabel,
  toFinancialYearPeriodKey,
} from './financial-year-period';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';

export interface ValidateRespondentUniquenessInput {
  formType: FormType;
  respondentPhone: string;
  completedAt?: string;
}

export type ValidateRespondentUniquenessResult =
  | { valid: true }
  | { valid: false; message: string };

export function financialYearPeriodFromKey(key: string): FinancialYearPeriod {
  const match = key.match(/^(JAN_JUN|JUL_DEC)_(\d+)$/);
  if (!match) {
    throw new Error(`Invalid financial year period key: ${key}`);
  }

  return {
    period: match[1] as FinancialYearPeriodHalf,
    year: Number(match[2]),
  };
}

export function buildDuplicateRespondentMessage(
  formType: FormType,
  financialYearPeriodKey: string
): string {
  const label = formatFinancialYearPeriodLabel(financialYearPeriodFromKey(financialYearPeriodKey));
  return `${formType} form already submitted for this respondent in ${label}.`;
}

export async function validateRespondentUniqueness(
  input: ValidateRespondentUniquenessInput,
  port: IRespondentUniquenessPort = respondentUniqueness
): Promise<ValidateRespondentUniquenessResult> {
  const completedAt = input.completedAt ?? new Date().toISOString();
  const financialYearPeriodKey = toFinancialYearPeriodKey(
    deriveFinancialYearPeriod(new Date(completedAt))
  );
  const respondentPhone = normalizeUgandaPhoneLocal(input.respondentPhone);

  const exists = await port.existsLocalDuplicate(
    input.formType,
    respondentPhone,
    financialYearPeriodKey
  );

  if (!exists) {
    return { valid: true };
  }

  return {
    valid: false,
    message: buildDuplicateRespondentMessage(input.formType, financialYearPeriodKey),
  };
}
