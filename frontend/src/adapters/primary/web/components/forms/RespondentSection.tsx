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
  showExactAge?: boolean;
  errors?: Partial<Record<keyof RespondentFields, string>>;
  locationRepository?: ILocationRepositoryPort;
}

export function RespondentSection({
  value,
  onChange,
  showExactAge = false,
  errors = {},
  locationRepository,
}: RespondentSectionProps) {
  const patch = (partial: Partial<RespondentFields>) => onChange({ ...value, ...partial });

  const handleLocationChange = (location: LocationFields) => {
    onChange({ ...value, ...location });
  };

  return (
    <FormSection title="Respondent details" description="Shared demographics captured for every PDM form.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Name of respondent"
          htmlFor="respondentName"
          required
          error={errors.respondentName}
        >
          <input
            id="respondentName"
            type="text"
            autoComplete="name"
            value={value.respondentName}
            onChange={(e) => patch({ respondentName: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Phone number"
          htmlFor="respondentPhone"
          required
          error={errors.respondentPhone}
          hint="Uganda format, e.g. 0772123456"
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
              <option key={gender} value={gender}>
                {gender}
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

        {showExactAge && (
          <FormField label="Exact age" htmlFor="exactAge" required error={errors.exactAge as string | undefined}>
            <input
              id="exactAge"
              type="number"
              min={15}
              inputMode="numeric"
              value={value.exactAge ?? ''}
              onChange={(e) =>
                patch({ exactAge: e.target.value === '' ? undefined : Number(e.target.value) })
              }
              className={formControlClassName}
              required
            />
          </FormField>
        )}
      </div>

      <CascadingLocationSelector
        value={value}
        onChange={handleLocationChange}
        repository={locationRepository}
      />
    </FormSection>
  );
}
