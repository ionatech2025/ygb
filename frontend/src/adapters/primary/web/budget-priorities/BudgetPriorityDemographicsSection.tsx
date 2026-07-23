import { useCallback, useMemo } from 'react';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
  type AgeGroup,
  type Gender,
} from '../../../../core/domain/form-validation.model';
import type { BudgetPriorityDemographicsFields } from '../../../../core/domain/budget-priority-submission.model';
import { EMPTY_LOCATION_FIELDS } from '../../../../core/domain/admin-location.model';
import { useCascadingLocation } from '../../../../core/hooks/useCascadingLocation';
import { UGANDA_PHONE_HINT } from '../../../../core/form-validation';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { FormField, formControlClassName } from '../components/forms/FormField';
import { FormSection } from '../components/forms/FormSection';
import type { BudgetPriorityFormErrors } from '../../../../core/domain/budget-priority-validation';
import { Loader2 } from 'lucide-react';

export interface BudgetPriorityDemographicsSectionProps {
  value: BudgetPriorityDemographicsFields;
  onChange: (value: BudgetPriorityDemographicsFields) => void;
  errors?: BudgetPriorityFormErrors;
  locationRepository?: ILocationRepositoryPort;
}

export function BudgetPriorityDemographicsSection({
  value,
  onChange,
  errors = {},
  locationRepository,
}: BudgetPriorityDemographicsSectionProps) {
  const patch = (partial: Partial<BudgetPriorityDemographicsFields>) => onChange({ ...value, ...partial });

  const locationValue = useMemo(
    () => ({
      ...EMPTY_LOCATION_FIELDS,
      districtId: value.districtId,
    }),
    [value.districtId]
  );

  const handleDistrictChange = useCallback(
    (location: { districtId: string }) => patch({ districtId: location.districtId }),
    [onChange, value]
  );

  const { districts, loading, ready, loadError, setDistrict } = useCascadingLocation(
    locationValue,
    handleDistrictChange,
    { repository: locationRepository }
  );

  const districtDisabled = loading || !ready;

  return (
    <FormSection
      title="Your details"
      description="Tell us who you are. No login is required — your phone number helps prevent duplicate submissions."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="bpFullName" required error={errors.fullName}>
          <input
            id="bpFullName"
            type="text"
            autoComplete="name"
            value={value.fullName}
            onChange={(e) => patch({ fullName: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Phone number"
          htmlFor="bpPhoneNumber"
          required
          error={errors.phoneNumber}
          hint={UGANDA_PHONE_HINT}
        >
          <input
            id="bpPhoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value.phoneNumber}
            onChange={(e) => patch({ phoneNumber: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField label="Gender" htmlFor="bpGender" required error={errors.gender}>
          <select
            id="bpGender"
            value={value.gender}
            onChange={(e) => patch({ gender: e.target.value as Gender | '' })}
            className={formControlClassName}
            required
          >
            <option value="">Select gender…</option>
            {GENDER_OPTIONS.map((gender) => (
              <option key={gender.value} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Age group" htmlFor="bpAgeGroup" required error={errors.ageGroup}>
          <select
            id="bpAgeGroup"
            value={value.ageGroup}
            onChange={(e) => patch({ ageGroup: e.target.value as AgeGroup })}
            className={formControlClassName}
            required
          >
            <option value="">Select age group…</option>
            {AGE_GROUP_VALUES.map((group) => (
              <option key={group} value={group}>
                {AGE_GROUP_LABELS[group]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="District" htmlFor="bpDistrict" required error={errors.districtId}>
          {loading && (
            <p className="mb-2 flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Loading districts…
            </p>
          )}
          {!loading && !ready && (
            <p className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              {loadError === 'fetch-failed'
                ? 'Unable to load districts. Check your connection and refresh the page.'
                : 'District list is unavailable offline. Connect once while online to download location data.'}
            </p>
          )}
          <select
            id="bpDistrict"
            value={value.districtId}
            onChange={(e) => setDistrict(e.target.value)}
            className={`${formControlClassName} disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={districtDisabled}
            required
            data-testid="budget-priority-district-select"
          >
            <option value="">{loading ? 'Loading districts…' : 'Select district…'}</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </FormSection>
  );
}
