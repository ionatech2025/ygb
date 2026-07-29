import type { LocationFields } from '../../../../../core/domain/admin-location.model';
import type { RespondentFields } from '../../../../../core/domain/respondent-fields.model';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
  type AgeGroup,
} from '../../../../../core/domain/form-validation.model';
import { CascadingLocationSelector } from '../CascadingLocationSelector';
import { FormField, formControlClassName } from './FormField';
import { FormSelect } from './FormSelect';
import { FormSection } from './FormSection';
import { UGANDA_PHONE_HINT } from '../../../../../core/form-validation';
import type { ILocationRepositoryPort } from '../../../../../ports/location-repository.port';

export interface RespondentSectionProps {
  value: RespondentFields;
  onChange: (value: RespondentFields) => void;
  errors?: Partial<Record<keyof RespondentFields, string>>;
  locationRepository?: ILocationRepositoryPort;
}

export function RespondentSection({
  value,
  onChange,
  errors = {},
  locationRepository,
}: RespondentSectionProps) {
  const patch = (partial: Partial<RespondentFields>) => onChange({ ...value, ...partial });

  const handleLocationChange = (location: LocationFields) => {
    onChange({ ...value, ...location });
  };

  return (
    <FormSection
      title="Respondent details"
      description="Shared demographics captured for every PDM form. Name is optional when respondents prefer anonymity."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Name of respondent"
          htmlFor="respondentName"
          error={errors.respondentName}
          hint="Optional — leave blank if the respondent prefers not to be named."
        >
          <input
            id="respondentName"
            type="text"
            autoComplete="name"
            value={value.respondentName}
            onChange={(e) => patch({ respondentName: e.target.value })}
            className={formControlClassName}
          />
        </FormField>

        <FormField
          label="Phone number"
          htmlFor="respondentPhone"
          required
          error={errors.respondentPhone}
          hint={UGANDA_PHONE_HINT}
        >
          <input
            id="respondentPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value.respondentPhone}
            onChange={(e) => patch({ respondentPhone: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField label="Gender" htmlFor="respondentGender" required error={errors.respondentGender}>
          <FormSelect
            id="respondentGender"
            value={value.respondentGender}
            onChange={(next) => patch({ respondentGender: next })}
            options={GENDER_OPTIONS}
            placeholder="Select gender…"
            required
          />
        </FormField>

        <FormField label="Age group" htmlFor="respondentAgeGroup" required error={errors.respondentAgeGroup}>
          <FormSelect
            id="respondentAgeGroup"
            value={value.respondentAgeGroup}
            onChange={(next) => patch({ respondentAgeGroup: next as AgeGroup })}
            options={AGE_GROUP_VALUES.map((group) => ({
              value: group,
              label: AGE_GROUP_LABELS[group],
            }))}
            placeholder="Select age group…"
            required
          />
        </FormField>
      </div>

      <CascadingLocationSelector
        value={value}
        onChange={handleLocationChange}
        repository={locationRepository}
      />
    </FormSection>
  );
}
