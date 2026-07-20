import { FormField, formControlClassName } from './FormField';
import { MULTI_SELECT_OTHER_VALUE } from '../../../../../core/domain/form-validation.model';

export interface MultiCheckboxOption {
  value: string;
  label: string;
}

export interface MultiCheckboxGroupProps {
  legend: string;
  options: MultiCheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  otherSpecifyValue?: string;
  onOtherSpecifyChange?: (value: string) => void;
  otherOptionValue?: string;
  otherSpecifyLabel?: string;
  required?: boolean;
  error?: string;
  otherSpecifyError?: string;
}

export function MultiCheckboxGroup({
  legend,
  options,
  selected,
  onChange,
  otherSpecifyValue = '',
  onOtherSpecifyChange,
  otherOptionValue = MULTI_SELECT_OTHER_VALUE,
  otherSpecifyLabel = 'Please specify',
  required,
  error,
  otherSpecifyError,
}: MultiCheckboxGroupProps) {
  const showOtherSpecify = selected.includes(otherOptionValue);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <fieldset className="space-y-2">
      <legend className="block text-xs font-semibold text-text mb-2">
        {legend}
        {required && (
          <span className="text-rose-600 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="space-y-2">
        {options.map((option) => {
          const inputId = `multi-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className="flex items-center gap-3 min-h-11 px-3 rounded-xl border border-border bg-surface-muted cursor-pointer transition-colors hover:bg-brand-light/60 has-[:checked]:border-brand/40 has-[:checked]:bg-brand-light/40 dark:has-[:checked]:bg-brand/20"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="h-4 w-4 rounded border-border text-brand focus:ring-brand/30"
              />
              <span className="text-sm text-text">{option.label}</span>
            </label>
          );
        })}
      </div>
      {showOtherSpecify && onOtherSpecifyChange && (
        <FormField
          label={otherSpecifyLabel}
          htmlFor={`${legend}-other-specify`}
          required
          error={otherSpecifyError}
        >
          <input
            id={`${legend}-other-specify`}
            type="text"
            value={otherSpecifyValue}
            onChange={(e) => onOtherSpecifyChange(e.target.value)}
            className={formControlClassName}
            required
          />
        </FormField>
      )}
      {error && (
        <p className="text-[11px] text-rose-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
