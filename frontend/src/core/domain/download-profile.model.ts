import { AGE_GROUP_LABELS, AGE_GROUP_VALUES, GENDER_OPTIONS } from './form-validation.model';

export const DOWNLOAD_EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const DOWNLOAD_AGE_GROUP_OPTIONS = [
  { value: 'AGE_BELOW_18', label: 'Below 18' },
  ...AGE_GROUP_VALUES.map((value) => ({ value, label: AGE_GROUP_LABELS[value] })),
] as const;

export type DownloadAgeGroup = (typeof DOWNLOAD_AGE_GROUP_OPTIONS)[number]['value'];

export const FIELD_OF_OPERATION_OPTIONS = [
  { value: 'ACADEMIA_RESEARCH', label: 'Academia/Research' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'NGO_CSO', label: 'NGO/CSO' },
  { value: 'DONOR_DEVELOPMENT_PARTNER', label: 'Donor/Development partner' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'PRIVATE_SECTOR', label: 'Private sector' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'OTHER', label: 'Other' },
] as const;

export type FieldOfOperation = (typeof FIELD_OF_OPERATION_OPTIONS)[number]['value'];

export type DownloadGender = (typeof GENDER_OPTIONS)[number]['value'];

export interface DownloadProfileFormValues {
  email: string;
  optionalName: string;
  countryCode: string;
  gender: string;
  ageGroup: string;
  fieldOfOperation: string;
  fieldOfOperationSpecify: string;
  consentGiven: boolean;
}

export type DownloadProfileFormErrors = Partial<
  Record<keyof DownloadProfileFormValues, string>
>;

export interface RegisterDownloadProfileRequest {
  email: string;
  optionalName?: string | null;
  countryCode: string;
  gender: string;
  ageGroup: string;
  fieldOfOperation: string;
  fieldOfOperationSpecify?: string | null;
  consentGiven: boolean;
}

export const DOWNLOAD_PROFILE_PRIVACY_NOTICE =
  'We collect this information to understand who uses Youth Go Budget App open data. ' +
  'Your details support programme analytics and may appear in admin reports. ' +
  'Public charts and donor PDFs use aggregates only — email and name are never shown there.';

export const DOWNLOAD_PROFILE_CONSENT_LABEL =
  'I agree to the use of my details as described above.';

export function isValidDownloadEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return DOWNLOAD_EMAIL_PATTERN.test(normalized);
}

function requiresFieldOfOperationSpecify(fieldOfOperation: string): boolean {
  return fieldOfOperation === 'OTHER';
}

export function validateDownloadProfileForm(
  values: DownloadProfileFormValues
): DownloadProfileFormErrors {
  const errors: DownloadProfileFormErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidDownloadEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.countryCode.trim()) {
    errors.countryCode = 'Country is required.';
  } else if (!/^[A-Za-z]{2}$/.test(values.countryCode.trim())) {
    errors.countryCode = 'Select a valid country.';
  }

  if (!values.gender) {
    errors.gender = 'Gender is required.';
  }

  if (!values.ageGroup) {
    errors.ageGroup = 'Age group is required.';
  }

  if (!values.fieldOfOperation) {
    errors.fieldOfOperation = 'Field of operation is required.';
  } else if (
    requiresFieldOfOperationSpecify(values.fieldOfOperation) &&
    !values.fieldOfOperationSpecify.trim()
  ) {
    errors.fieldOfOperationSpecify = 'Please specify your field of operation.';
  }

  if (!values.consentGiven) {
    errors.consentGiven = 'Consent is required to continue.';
  }

  return errors;
}

export function isDownloadProfileFormSubmittable(values: DownloadProfileFormValues): boolean {
  return Object.keys(validateDownloadProfileForm(values)).length === 0;
}

export function toRegisterDownloadProfileRequest(
  values: DownloadProfileFormValues
): RegisterDownloadProfileRequest {
  const optionalName = values.optionalName.trim();
  const specify = values.fieldOfOperationSpecify.trim();
  return {
    email: values.email.trim().toLowerCase(),
    optionalName: optionalName.length > 0 ? optionalName : null,
    countryCode: values.countryCode.trim().toUpperCase(),
    gender: values.gender,
    ageGroup: values.ageGroup,
    fieldOfOperation: values.fieldOfOperation,
    fieldOfOperationSpecify:
      requiresFieldOfOperationSpecify(values.fieldOfOperation) && specify.length > 0
        ? specify
        : null,
    consentGiven: values.consentGiven,
  };
}

export function emptyDownloadProfileFormValues(): DownloadProfileFormValues {
  return {
    email: '',
    optionalName: '',
    countryCode: '',
    gender: '',
    ageGroup: '',
    fieldOfOperation: '',
    fieldOfOperationSpecify: '',
    consentGiven: false,
  };
}
