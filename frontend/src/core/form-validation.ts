import { MIN_DURATION_TEXT_LENGTH, MIN_NARRATIVE_LENGTH } from './domain/form-validation.model';
import { isValidUgandaPhoneLocal } from './utils/phone-utils';

export const UGANDA_PHONE_HINT = 'Uganda mobile, e.g. 0746532164 or +256746532164';
export const UGANDA_PHONE_ERROR =
  'Enter a valid Uganda mobile number (10 digits starting with 07… or +2567… / +25639…).';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateRequired(value: string | null | undefined): ValidationResult {
  if (value == null || value.trim() === '') {
    return { valid: false, message: 'This field is required.' };
  }
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();
  if (trimmed === '') {
    return { valid: false, message: 'Phone number is required.' };
  }
  if (!isValidUgandaPhoneLocal(trimmed)) {
    return { valid: false, message: UGANDA_PHONE_ERROR };
  }
  return { valid: true };
}

export function validateNarrativeText(
  value: string | null | undefined,
  options: { required?: boolean; minLength?: number } = {}
): ValidationResult {
  const minLength = options.minLength ?? MIN_NARRATIVE_LENGTH;
  const trimmed = value?.trim() ?? '';
  if (trimmed === '') {
    return options.required
      ? { valid: false, message: `Please provide at least ${minLength} characters.` }
      : { valid: true };
  }
  if (trimmed.length < minLength) {
    return { valid: false, message: `Please provide at least ${minLength} characters.` };
  }
  return { valid: true };
}

/** Duration-style answers such as "2 days" or "10 months". */
export function validateDurationText(
  value: string | null | undefined,
  options: { required?: boolean } = {}
): ValidationResult {
  return validateNarrativeText(value, {
    required: options.required,
    minLength: MIN_DURATION_TEXT_LENGTH,
  });
}
