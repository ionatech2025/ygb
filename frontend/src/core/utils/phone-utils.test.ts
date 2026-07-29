import { describe, expect, it } from 'vitest';
import { isValidUgandaPhoneLocal, normalizeUgandaPhoneLocal } from './phone-utils';

const VALID_PREFIXES = ['077', '078', '076', '039', '075', '070', '074', '072', '071', '079'] as const;

describe('phone-utils', () => {
  it('normalizes +256 international format to local', () => {
    expect(normalizeUgandaPhoneLocal('+256772123456')).toBe('0772123456');
    expect(normalizeUgandaPhoneLocal('+256752350470')).toBe('0752350470');
    expect(normalizeUgandaPhoneLocal('+256746532164')).toBe('0746532164');
    expect(normalizeUgandaPhoneLocal('+256391234567')).toBe('0391234567');
    expect(normalizeUgandaPhoneLocal('+256 752 350 470')).toBe('0752350470');
  });

  it.each(VALID_PREFIXES)('accepts local number with prefix %s', (prefix) => {
    const localNumber = `${prefix}1234567`;
    expect(isValidUgandaPhoneLocal(localNumber)).toBe(true);
    expect(normalizeUgandaPhoneLocal(localNumber)).toBe(localNumber);
  });

  it('accepts +256 international format as valid', () => {
    expect(isValidUgandaPhoneLocal('+256752350470')).toBe(true);
    expect(isValidUgandaPhoneLocal('+256772123456')).toBe(true);
    expect(isValidUgandaPhoneLocal('+256746532164')).toBe(true);
  });

  it('rejects invalid numbers after normalization', () => {
    expect(isValidUgandaPhoneLocal('+256123')).toBe(false);
    expect(isValidUgandaPhoneLocal('12345')).toBe(false);
    expect(isValidUgandaPhoneLocal('0671234567')).toBe(false);
    expect(isValidUgandaPhoneLocal('077212345')).toBe(false);
  });
});
