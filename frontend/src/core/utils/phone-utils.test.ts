import { describe, expect, it } from 'vitest';
import { isValidUgandaPhoneLocal, normalizeUgandaPhoneLocal } from './phone-utils';

describe('phone-utils', () => {
  it('normalizes +256 international format to local', () => {
    expect(normalizeUgandaPhoneLocal('+256772123456')).toBe('0772123456');
    expect(normalizeUgandaPhoneLocal('+256752350470')).toBe('0752350470');
    expect(normalizeUgandaPhoneLocal('+256 752 350 470')).toBe('0752350470');
  });

  it('accepts +256 international format as valid', () => {
    expect(isValidUgandaPhoneLocal('+256752350470')).toBe(true);
    expect(isValidUgandaPhoneLocal('+256772123456')).toBe(true);
  });

  it('rejects invalid numbers after normalization', () => {
    expect(isValidUgandaPhoneLocal('+256123')).toBe(false);
    expect(isValidUgandaPhoneLocal('12345')).toBe(false);
  });
});
