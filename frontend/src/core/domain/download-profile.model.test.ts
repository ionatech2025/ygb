import { describe, expect, it } from 'vitest';
import {
  DOWNLOAD_AGE_GROUP_OPTIONS,
  FIELD_OF_OPERATION_OPTIONS,
  isDownloadProfileFormSubmittable,
  isValidDownloadEmail,
  validateDownloadProfileForm,
  type DownloadProfileFormValues,
} from './download-profile.model';

function validForm(overrides: Partial<DownloadProfileFormValues> = {}): DownloadProfileFormValues {
  return {
    email: 'analyst@example.com',
    optionalName: '',
    countryCode: 'UG',
    gender: 'FEMALE',
    ageGroup: 'AGE_25_29',
    fieldOfOperation: 'ACADEMIA_RESEARCH',
    fieldOfOperationSpecify: '',
    consentGiven: true,
    ...overrides,
  };
}

describe('download-profile.model', () => {
  it('includes Below 18 plus programme age brackets', () => {
    expect(DOWNLOAD_AGE_GROUP_OPTIONS.map((option) => option.value)).toEqual([
      'AGE_BELOW_18',
      'AGE_18_24',
      'AGE_25_29',
      'AGE_30_35',
      'AGE_ABOVE_35',
    ]);
  });

  it('lists fixed field-of-operation values including Other', () => {
    expect(FIELD_OF_OPERATION_OPTIONS.map((option) => option.value)).toContain('OTHER');
    expect(FIELD_OF_OPERATION_OPTIONS.find((option) => option.value === 'NGO_CSO')?.label).toBe(
      'NGO/CSO'
    );
  });

  it('accepts RFC-style emails and rejects malformed ones', () => {
    expect(isValidDownloadEmail('analyst@example.com')).toBe(true);
    expect(isValidDownloadEmail('  Ada.Lovelace+ygb@Example.ORG  ')).toBe(true);
    expect(isValidDownloadEmail('not-an-email')).toBe(false);
    expect(isValidDownloadEmail('missing@tld')).toBe(false);
    expect(isValidDownloadEmail('')).toBe(false);
  });

  it('is not submittable until required fields and consent are valid', () => {
    expect(isDownloadProfileFormSubmittable(validForm({ consentGiven: false }))).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm({ email: 'not-an-email' }))).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm({ countryCode: '' }))).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm({ gender: '' }))).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm({ ageGroup: '' }))).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm({ fieldOfOperation: '' }))).toBe(false);
    expect(
      isDownloadProfileFormSubmittable(
        validForm({ fieldOfOperation: 'OTHER', fieldOfOperationSpecify: '' })
      )
    ).toBe(false);
    expect(isDownloadProfileFormSubmittable(validForm())).toBe(true);
    expect(
      isDownloadProfileFormSubmittable(
        validForm({ fieldOfOperation: 'OTHER', fieldOfOperationSpecify: 'Independent consultant' })
      )
    ).toBe(true);
  });

  it('returns field errors for invalid email, missing consent, and Other without specify', () => {
    expect(validateDownloadProfileForm(validForm({ email: 'not-an-email' })).email).toMatch(
      /valid email/i
    );
    expect(validateDownloadProfileForm(validForm({ consentGiven: false })).consentGiven).toMatch(
      /consent/i
    );
    expect(
      validateDownloadProfileForm(
        validForm({ fieldOfOperation: 'OTHER', fieldOfOperationSpecify: '   ' })
      ).fieldOfOperationSpecify
    ).toMatch(/specify/i);
    expect(validateDownloadProfileForm(validForm())).toEqual({});
  });
});
