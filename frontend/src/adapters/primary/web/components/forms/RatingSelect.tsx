import { FormField, formControlClassName } from './FormField';
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
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Rating)}
        className={formControlClassName}
        required={required}
      >
        <option value="" disabled>
          Select a rating
        </option>
        {RATING_VALUES.map((rating) => (
          <option key={rating} value={rating}>
            {RATING_LABELS[rating]}
          </option>
        ))}
      </select>
    </FormField>
  );
}
