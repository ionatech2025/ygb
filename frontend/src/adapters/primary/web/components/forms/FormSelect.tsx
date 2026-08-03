import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { formControlClassName } from './FormField';

export interface FormSelectOption {
  value: string;
  label: string;
}

export const FORM_SELECT_ALL_VALUE = '';
export const FORM_SELECT_ALL_LABEL = 'Select All';

export interface FormSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /**
   * When true, prepends a clearing option labeled "Select All".
   * Defaults to true for optional selects and false for required selects.
   */
  includeSelectAll?: boolean;
  testId?: string;
}

export function withSelectAllOption(
  options: readonly FormSelectOption[],
  includeSelectAll: boolean
): FormSelectOption[] {
  if (!includeSelectAll) {
    return [...options];
  }
  const withoutEmpty = options.filter((option) => option.value !== FORM_SELECT_ALL_VALUE);
  return [{ value: FORM_SELECT_ALL_VALUE, label: FORM_SELECT_ALL_LABEL }, ...withoutEmpty];
}

const OPTION_LIST_BASE_CLASS_NAME =
  'z-50 overflow-y-auto overscroll-contain rounded-xl border border-border divide-y divide-border bg-surface shadow-lg';

function optionRowClassName(selected: boolean, disabled?: boolean): string {
  return [
    'flex min-h-11 w-full items-start gap-3 px-3 py-2.5 text-left transition-colors',
    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-muted/80',
    selected ? 'bg-brand-light/40 dark:bg-brand/15' : 'bg-surface',
  ].join(' ');
}

function optionInputId(id: string, value: string): string {
  return `${id}-opt-${value || '__empty__'}`;
}

function maxPanelHeight(): number {
  return Math.min(280, window.innerHeight * 0.4);
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
  listRef,
  style,
}: {
  id: string;
  containerId: string;
  groupName: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  disabled?: boolean;
  required?: boolean;
  listRef: RefObject<HTMLDivElement | null>;
  style: CSSProperties;
}) {
  return (
    <div
      ref={listRef}
      id={containerId}
      role="listbox"
      aria-labelledby={`${id}-label`}
      className={OPTION_LIST_BASE_CLASS_NAME}
      style={style}
      data-testid={`${id}-option-list`}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const inputId = optionInputId(id, option.value);
        return (
          <label key={option.value || '__empty__'} htmlFor={inputId} className={optionRowClassName(selected, disabled)}>
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
  includeSelectAll = !required,
  testId,
}: FormSelectProps) {
  const groupName = useId();
  const listId = `${id}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const resolvedOptions = withSelectAllOption(options, includeSelectAll);
  const selectedLabel = resolvedOptions.find((option) => option.value === value)?.label;

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const gap = 4;
    const panelMaxHeight = maxPanelHeight();
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward = spaceBelow < panelMaxHeight && spaceAbove > spaceBelow;
    const availableHeight = openUpward ? spaceAbove : spaceBelow;

    setPanelStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, Math.min(panelMaxHeight, availableHeight)),
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    updatePanelPosition();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onLayoutChange = () => updatePanelPosition();

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onLayoutChange);
    window.addEventListener('scroll', onLayoutChange, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onLayoutChange);
      window.removeEventListener('scroll', onLayoutChange, true);
    };
  }, [open, updatePanelPosition]);

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        data-testid={testId}
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
      {open &&
        createPortal(
          <OptionList
            id={id}
            containerId={listId}
            groupName={groupName}
            value={value}
            onChange={handleChange}
            options={resolvedOptions}
            disabled={disabled}
            required={required}
            listRef={listRef}
            style={panelStyle}
          />,
          document.body
        )}
    </div>
  );
}
