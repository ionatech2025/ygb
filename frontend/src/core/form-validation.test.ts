import { describe, expect, it } from 'vitest';
import {
  validateNarrativeText,
  validatePhone,
  validateRequired,
} from './form-validation';

describe('form-validation', () => {
  it('rejects short narrative text', () => {
    expect(validateNarrativeText('ok').valid).toBe(false);
  });

  it('accepts narrative text with at least 10 characters', () => {
    expect(validateNarrativeText('Hello world!').valid).toBe(true);
  });

  it('rejects empty required values', () => {
    expect(validateRequired('   ').valid).toBe(false);
  });

  it('accepts valid uganda phone numbers', () => {
    expect(validatePhone('0772123456').valid).toBe(true);
    expect(validatePhone('0746532164').valid).toBe(true);
    expect(validatePhone('+256772123456').valid).toBe(true);
    expect(validatePhone('+256746532164').valid).toBe(true);
    expect(validatePhone('+256752350470').valid).toBe(true);
    expect(validatePhone('+256 752 350 470').valid).toBe(true);
  });

  it('rejects invalid uganda phone numbers', () => {
    expect(validatePhone('+256123').valid).toBe(false);
    expect(validatePhone('12345').valid).toBe(false);
    expect(validatePhone('0671234567').valid).toBe(false);
  });
});
