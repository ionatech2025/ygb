import { describe, expect, it } from 'vitest';
import { EMPTY_RESPONDENT_FIELDS } from './domain/respondent-fields.model';
import { formatRespondentName, validateRespondentDemographics } from './respondent-validation';

describe('respondent-validation', () => {
  it('does not require respondent name', () => {
    const errors: Record<string, string> = {};
    validateRespondentDemographics(
      { ...EMPTY_RESPONDENT_FIELDS, respondentName: '   ' },
      errors
    );
    expect(errors.respondentName).toBeUndefined();
  });

  it('formats optional respondent name as trimmed text', () => {
    expect(formatRespondentName('  Jane  ')).toBe('Jane');
    expect(formatRespondentName('   ')).toBe('');
  });
});
