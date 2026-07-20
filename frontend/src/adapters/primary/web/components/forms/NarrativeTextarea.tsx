import { FormField, formControlClassName } from './FormField';
import { validateNarrativeText } from '../../../../../core/form-validation';

export interface NarrativeTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export function NarrativeTextarea({
  id,
  label,
  value,
  onChange,
  required,
  rows = 4,
  placeholder,
}: NarrativeTextareaProps) {
  const validation = validateNarrativeText(value, { required });
  const showError = value.trim().length > 0 && !validation.valid;

  return (
    <FormField
      label={label}
      htmlFor={id}
      required={required}
      error={showError ? validation.message : undefined}
      hint="Minimum 10 characters when provided."
    >
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`${formControlClassName} resize-y min-h-[6rem]`}
        required={required}
        aria-live="polite"
      />
    </FormField>
  );
}
