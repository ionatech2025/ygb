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
import { FormSection } from './FormSection';
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
          hint="Uganda format, e.g. 0772123456 or +256772123456"
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
          <select
            id="respondentGender"
            value={value.respondentGender}
            onChange={(e) => patch({ respondentGender: e.target.value })}
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

        <FormField label="Age group" htmlFor="respondentAgeGroup" required error={errors.respondentAgeGroup}>
          <select
            id="respondentAgeGroup"
            value={value.respondentAgeGroup}
            onChange={(e) => patch({ respondentAgeGroup: e.target.value as AgeGroup })}
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
      </div>

      <CascadingLocationSelector
        value={value}
        onChange={handleLocationChange}
        repository={locationRepository}
      />
    </FormSection>
  );
}
