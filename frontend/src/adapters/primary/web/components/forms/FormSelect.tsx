import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { formControlClassName } from './FormField';

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Collapsed trigger + expandable list — use for long option lists (e.g. locations). */
  collapsible?: boolean;
}

function optionRowClassName(selected: boolean, disabled?: boolean): string {
  return [
    'flex min-h-11 w-full items-start gap-3 px-3 py-2.5 text-left transition-colors',
    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-muted/80',
    selected ? 'bg-brand-light/40 dark:bg-brand/15' : 'bg-surface',
  ].join(' ');
}

function OptionList({
  id,
  containerId,
  groupName,
  value,
  onChange,
  options,
  disabled,
  required,
}: {
  id: string;
  containerId: string;
  groupName: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div
      id={containerId}
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      className="overflow-hidden rounded-xl border border-border divide-y divide-border"
      data-testid={`${id}-option-list`}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const inputId = `${id}-${option.value}`;
        return (
          <label key={option.value} htmlFor={inputId} className={optionRowClassName(selected, disabled)}>
            <input
              id={inputId}
              type="radio"
              name={groupName}
              value={option.value}
              checked={selected}
              disabled={disabled}
              required={required && !value}
              onChange={() => onChange(option.value)}
              className="mt-0.5 h-4 w-4 shrink-0 border-border text-brand focus:ring-brand/30"
            />
            <span className="min-w-0 flex-1 text-sm leading-snug text-text break-words">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function FormSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  required = false,
  collapsible = false,
}: FormSelectProps) {
  const groupName = useId();
  const listId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    if (collapsible) {
      setOpen(false);
    }
  };

  if (collapsible) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${id}-label`}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className={`${formControlClassName} flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed`}
        >
          <span className={`min-w-0 flex-1 truncate ${selectedLabel ? 'text-text' : 'text-text-muted'}`}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <OptionList
            id={id}
            containerId={listId}
            groupName={groupName}
            value={value}
            onChange={handleChange}
            options={options}
            disabled={disabled}
            required={required}
          />
        )}
      </div>
    );
  }

  return (
    <OptionList
      id={id}
      containerId={id}
      groupName={groupName}
      value={value}
      onChange={handleChange}
      options={options}
      disabled={disabled}
      required={required}
    />
  );
}
