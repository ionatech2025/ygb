import { FormField } from './FormField';

export interface YesNoRadioGroupProps {
  name: string;
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
  error?: string;
}

export function YesNoRadioGroup({ name, label, value, onChange, required, error }: YesNoRadioGroupProps) {
  return (
    <FormField label={label} htmlFor={`${name}-yes`} required={required} error={error}>
      <div className="flex gap-3">
        {[
          { id: `${name}-yes`, label: 'Yes', choice: true },
          { id: `${name}-no`, label: 'No', choice: false },
        ].map(({ id, label: optionLabel, choice }) => (
          <label
            key={id}
            htmlFor={id}
            className="flex flex-1 items-center justify-center gap-2 min-h-11 px-4 rounded-xl border border-border bg-surface cursor-pointer transition-all hover:border-brand/40 has-[:checked]:border-brand has-[:checked]:bg-brand-light/50 dark:has-[:checked]:bg-brand/20"
          >
            <input
              id={id}
              type="radio"
              name={name}
              checked={value === choice}
              onChange={() => onChange(choice)}
              className="h-4 w-4 border-border text-brand focus:ring-brand/30"
              required={required && value === null}
            />
            <span className="text-sm font-medium text-text">{optionLabel}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
}
