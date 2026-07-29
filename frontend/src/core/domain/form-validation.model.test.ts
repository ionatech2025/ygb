import { describe, expect, it } from 'vitest';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  formatAgeGroupLabel,
} from './form-validation.model';

describe('form-validation.model age groups', () => {
  it('defines programme target brackets for 18–35 field collection', () => {
    expect(AGE_GROUP_VALUES).toEqual([
      'AGE_18_24',
      'AGE_25_29',
      'AGE_30_35',
      'AGE_ABOVE_35',
    ]);
    expect(AGE_GROUP_LABELS.AGE_18_24).toBe('18-24');
    expect(AGE_GROUP_LABELS.AGE_25_29).toBe('25-29');
    expect(AGE_GROUP_LABELS.AGE_30_35).toBe('30-35');
    expect(AGE_GROUP_LABELS.AGE_ABOVE_35).toBe('Above 35');
  });

  it('formats legacy age group codes from historical submissions', () => {
    expect(formatAgeGroupLabel('AGE_15_19')).toBe('15-19');
    expect(formatAgeGroupLabel('AGE_20_24')).toBe('20-24');
    expect(formatAgeGroupLabel('AGE_30_AND_ABOVE')).toBe('30+');
    expect(formatAgeGroupLabel('AGE_18_24')).toBe('18-24');
  });
});
