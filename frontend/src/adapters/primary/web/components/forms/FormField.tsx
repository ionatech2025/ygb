import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, error, hint, children }: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700">
        {label}
        {required && (
          <span className="text-rose-600 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-[11px] text-slate-500">
          {hint}
        </p>
      )}
      <div
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
      >
        {children}
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
  'w-full min-h-11 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl ' +
  'transition-[border-color,box-shadow] duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:border-brand ' +
  'disabled:bg-slate-50 disabled:text-slate-400';
