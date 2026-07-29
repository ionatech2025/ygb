import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  hintPosition?: 'above' | 'below';
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  hintPosition = 'above',
  children,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label id={`${htmlFor}-label`} htmlFor={htmlFor} className="block text-xs font-semibold text-text">
        {label}
        {required && (
          <span className="text-rose-600 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && hintPosition === 'above' && (
        <p id={hintId} className="text-[11px] text-text-muted">
          {hint}
        </p>
      )}
      <div
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
      >
        {children}
        {hint && hintPosition === 'below' && (
          <p id={hintId} className="mt-1.5 text-[11px] text-text-muted">
            {hint}
          </p>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-[11px] text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const formControlClassName =
  'box-border w-full h-11 min-h-11 px-3 py-2.5 text-sm text-text bg-surface border border-border rounded-xl ' +
  'transition-[border-color,box-shadow] duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:border-brand ' +
  'disabled:bg-surface-muted disabled:text-text-muted';
