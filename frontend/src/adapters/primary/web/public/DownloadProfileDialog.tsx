import { Download } from 'lucide-react';
import { useEffect, useId, useState, type FormEvent } from 'react';
import { ApiError } from '../../../../core/api/api-client';
import {
  DOWNLOAD_AGE_GROUP_OPTIONS,
  DOWNLOAD_PROFILE_CONSENT_LABEL,
  DOWNLOAD_PROFILE_PRIVACY_NOTICE,
  emptyDownloadProfileFormValues,
  FIELD_OF_OPERATION_OPTIONS,
  isDownloadProfileFormSubmittable,
  toRegisterDownloadProfileRequest,
  validateDownloadProfileForm,
  type DownloadProfileFormValues,
} from '../../../../core/domain/download-profile.model';
import type { DownloadSession } from '../../../../core/domain/download-session.model';
import { GENDER_OPTIONS } from '../../../../core/domain/form-validation.model';
import { ISO_COUNTRY_OPTIONS } from '../../../../core/domain/iso-countries';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import { writeDownloadSession } from '../../../secondary/storage/download-session.store';
import { FormField, formControlClassName } from '../components/forms/FormField';
import { FormSelect } from '../components/forms/FormSelect';
import { SearchableFormSelect } from '../components/forms/SearchableFormSelect';

export interface DownloadProfileDialogProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (session: DownloadSession) => void;
  api: IDownloadProfileApiPort;
}

export function DownloadProfileDialog({
  open,
  onCancel,
  onSuccess,
  api,
}: DownloadProfileDialogProps) {
  const titleId = useId();
  const [values, setValues] = useState<DownloadProfileFormValues>(emptyDownloadProfileFormValues);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setValues(emptyDownloadProfileFormValues());
    setTouchedEmail(false);
    setBusy(false);
    setSubmitError(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const errors = validateDownloadProfileForm(values);
  const showEmailError =
    Boolean(errors.email) && (touchedEmail || values.email.trim().length > 0);
  const canSubmit = isDownloadProfileFormSubmittable(values) && !busy;

  const update = <K extends keyof DownloadProfileFormValues>(
    key: K,
    value: DownloadProfileFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isDownloadProfileFormSubmittable(values) || busy) {
      return;
    }

    setBusy(true);
    setSubmitError(null);
    try {
      const session = await api.registerProfile(toRegisterDownloadProfileRequest(values));
      writeDownloadSession(session);
      onSuccess(session);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Could not save your download profile. Please try again.';
      setSubmitError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-xl sm:rounded-2xl"
        data-testid="download-profile-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border bg-gradient-to-br from-brand/10 via-surface to-nac-blue/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-brand/15 p-2 text-brand">
              <Download className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id={titleId} className="text-base font-bold tracking-tight text-text">
                Before you download
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Tell us a little about yourself so the programme can understand open-data use. No
                account is created.
              </p>
            </div>
          </div>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} noValidate>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <FormField label="Email" htmlFor="download-profile-email" required error={showEmailError ? errors.email : undefined}>
              <input
                id="download-profile-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                onBlur={() => setTouchedEmail(true)}
                className={formControlClassName}
                required
              />
            </FormField>

            <FormField
              label="Name"
              htmlFor="download-profile-name"
              hint="Optional"
              hintPosition="below"
            >
              <input
                id="download-profile-name"
                type="text"
                autoComplete="name"
                value={values.optionalName}
                onChange={(event) => update('optionalName', event.target.value)}
                className={formControlClassName}
              />
            </FormField>

            <FormField label="Country of residence" htmlFor="download-profile-country" required>
              <SearchableFormSelect
                id="download-profile-country"
                value={values.countryCode}
                onChange={(value) => update('countryCode', value)}
                options={ISO_COUNTRY_OPTIONS}
                placeholder="Search and select a country"
                searchPlaceholder="Type to search countries…"
                required
                testId="download-profile-country"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Gender" htmlFor="download-profile-gender" required>
                <FormSelect
                  id="download-profile-gender"
                  value={values.gender}
                  onChange={(value) => update('gender', value)}
                  options={[...GENDER_OPTIONS]}
                  required
                  includeSelectAll={false}
                />
              </FormField>

              <FormField label="Age group" htmlFor="download-profile-age" required>
                <FormSelect
                  id="download-profile-age"
                  value={values.ageGroup}
                  onChange={(value) => update('ageGroup', value)}
                  options={[...DOWNLOAD_AGE_GROUP_OPTIONS]}
                  required
                  includeSelectAll={false}
                />
              </FormField>
            </div>

            <FormField label="Field of operation" htmlFor="download-profile-field" required>
              <FormSelect
                id="download-profile-field"
                value={values.fieldOfOperation}
                onChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    fieldOfOperation: value,
                    fieldOfOperationSpecify:
                      value === 'OTHER' ? current.fieldOfOperationSpecify : '',
                  }))
                }
                options={[...FIELD_OF_OPERATION_OPTIONS]}
                required
                includeSelectAll={false}
              />
            </FormField>

            {values.fieldOfOperation === 'OTHER' && (
              <FormField
                label="Please specify"
                htmlFor="download-profile-field-specify"
                required
                error={errors.fieldOfOperationSpecify}
              >
                <input
                  id="download-profile-field-specify"
                  type="text"
                  value={values.fieldOfOperationSpecify}
                  onChange={(event) => update('fieldOfOperationSpecify', event.target.value)}
                  className={formControlClassName}
                  required
                />
              </FormField>
            )}

            <div className="rounded-xl border border-border bg-surface-muted/40 p-3">
              <p id="download-profile-privacy" className="text-xs leading-relaxed text-text-muted">
                {DOWNLOAD_PROFILE_PRIVACY_NOTICE}
              </p>
              <label
                htmlFor="download-profile-consent"
                className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-text"
              >
                <input
                  id="download-profile-consent"
                  type="checkbox"
                  checked={values.consentGiven}
                  onChange={(event) => update('consentGiven', event.target.checked)}
                  aria-describedby="download-profile-privacy"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-brand focus:ring-brand/30"
                  required
                />
                <span>
                  {DOWNLOAD_PROFILE_CONSENT_LABEL}
                  <span className="text-rose-600 ml-0.5" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </span>
              </label>
            </div>

            {submitError && (
              <p className="text-sm text-rose-600" role="alert">
                {submitError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors duration-150 hover:bg-surface-muted disabled:opacity-50"
              data-testid="download-profile-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="download-profile-submit"
            >
              {busy ? 'Saving…' : 'Continue to download'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
