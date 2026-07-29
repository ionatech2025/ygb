import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import { RATING_LABELS, RATING_VALUES, type Rating } from '../../../../../core/domain/form-validation.model';

export interface RatingSelectProps {
  id: string;
  label: string;
  value: Rating | '';
  onChange: (value: Rating) => void;
  required?: boolean;
  error?: string;
}

export function RatingSelect({ id, label, value, onChange, required, error }: RatingSelectProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <FormSelect
        id={id}
        value={value}
        onChange={(next) => onChange(next as Rating)}
        options={RATING_VALUES.map((rating) => ({
          value: rating,
          label: RATING_LABELS[rating],
        }))}
        placeholder="Select a rating"
        required={required}
      />
    </FormField>
  );
}
