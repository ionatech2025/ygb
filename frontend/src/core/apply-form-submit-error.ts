import { DuplicateRespondentError } from './duplicate-respondent.error';

export function applyDuplicateRespondentError<T extends Record<string, string>>(
  error: unknown,
  setErrors: (errors: T) => void,
  scrollToFirstError: (errors: T) => void
): boolean {
  if (!(error instanceof DuplicateRespondentError)) {
    return false;
  }

  const nextErrors = { respondentPhone: error.message } as unknown as T;
  setErrors(nextErrors);
  scrollToFirstError(nextErrors);
  return true;
}
