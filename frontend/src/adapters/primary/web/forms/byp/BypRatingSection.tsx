import type { Rating } from '../../../../../core/domain/form-validation.model';
import type { BypFormFields } from '../../../../../core/domain/byp-form.model';
import { FormSection, RatingSelect, YesNoRadioGroup } from '../../components/forms';

export interface BypRatingSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypRatingSection({ value, onChange, errors }: BypRatingSectionProps) {
  const patch = (partial: Partial<BypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Service quality & governance" description="Questions 5–7">
      <RatingSelect
        id="serviceRating"
        label="Q5. PDC / Parish Chief service rating"
        value={value.serviceRating}
        onChange={(rating: Rating) => patch({ serviceRating: rating })}
        required
        error={errors.serviceRating}
      />
      <RatingSelect
        id="performanceRating"
        label="Q6. PDM performance rating"
        value={value.performanceRating}
        onChange={(rating: Rating) => patch({ performanceRating: rating })}
        required
        error={errors.performanceRating}
      />
      <YesNoRadioGroup
        name="groupOrganizedTransparently"
        label="Q7. Was the group organized transparently?"
        value={value.groupOrganizedTransparently}
        onChange={(choice) => patch({ groupOrganizedTransparently: choice })}
        required
        error={errors.groupOrganizedTransparently}
      />
    </FormSection>
  );
}
