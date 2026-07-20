import { describe, expect, it } from 'vitest';
import {
  validateAge,
  validateNarrativeText,
  validatePhone,
  validateRequired,
} from './form-validation';

describe('form-validation', () => {
  it('rejects age below 15', () => {
    expect(validateAge(14).valid).toBe(false);
  });

  it('accepts age of 15', () => {
    expect(validateAge(15).valid).toBe(true);
  });

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
  });
});
