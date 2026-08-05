import { ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { formControlClassName } from './FormField';
import type { FormSelectOption } from './FormSelect';

export interface SearchableFormSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  testId?: string;
}

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
  return Math.min(320, window.innerHeight * 0.45);
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
  search,
  onSearchChange,
  searchPlaceholder,
  searchInputRef,
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
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div
      ref={listRef}
      id={containerId}
      className="z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
      style={style}
      data-testid={`${id}-option-list`}
    >
      <div className="border-b border-border p-2">
        <label className="sr-only" htmlFor={`${id}-search`}>
          Search countries
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={`${formControlClassName} h-10 min-h-10 pl-9`}
            autoComplete="off"
          />
        </div>
      </div>
      <div
        role="listbox"
        aria-labelledby={`${id}-label`}
        className="max-h-[min(240px,40vh)] overflow-y-auto overscroll-contain divide-y divide-border"
      >
        {options.length === 0 ? (
          <p className="px-3 py-3 text-sm text-text-muted">No matching countries.</p>
        ) : (
          options.map((option) => {
            const selected = value === option.value;
            const inputId = optionInputId(id, option.value);
            return (
              <label
                key={option.value || '__empty__'}
                htmlFor={inputId}
                className={optionRowClassName(selected, disabled)}
              >
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
                <span className="min-w-0 flex-1 text-sm leading-snug text-text break-words">
                  {option.label}
                  <span className="ml-2 text-xs text-text-muted tabular-nums">{option.value}</span>
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}

export function SearchableFormSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  required = false,
  testId,
}: SearchableFormSelectProps) {
  const groupName = useId();
  const listId = `${id}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const selectedLabel = options.find((option) => option.value === value)?.label;

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return options;
    }
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q)
    );
  }, [options, search]);

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
      maxHeight: Math.max(160, Math.min(panelMaxHeight, availableHeight)),
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
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 0);

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
        setSearch('');
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    };
    const onLayoutChange = () => updatePanelPosition();

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onLayoutChange);
    window.addEventListener('scroll', onLayoutChange, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onLayoutChange);
      window.removeEventListener('scroll', onLayoutChange, true);
    };
  }, [open, updatePanelPosition]);

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setSearch('');
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
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
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
            options={filteredOptions}
            disabled={disabled}
            required={required}
            listRef={listRef}
            style={panelStyle}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder={searchPlaceholder}
            searchInputRef={searchInputRef}
          />,
          document.body
        )}
    </div>
  );
}
