import { FormField, formControlClassName } from '../components/forms/FormField';
import { FormSection } from '../components/forms/FormSection';

export interface LgoRationaleSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function LgoRationaleSection({ value, onChange, error }: LgoRationaleSectionProps) {
  return (
    <FormSection
      title="Rationale"
      description="Why were previous financial year allocations structured this way?"
    >
      <FormField label="Allocation rationale" htmlFor="lgoRationale" required error={error}>
        <textarea
          id="lgoRationale"
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${formControlClassName} min-h-[8rem] resize-y`}
          aria-invalid={Boolean(error)}
          data-testid="lgo-rationale-section"
        />
      </FormField>
    </FormSection>
  );
}
