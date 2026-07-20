import type { ReactNode } from 'react';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
      <header className="space-y-1 border-b border-border pb-3">
        <h3 className="text-sm font-bold text-text tracking-tight">{title}</h3>
        {description && <p className="text-xs text-text-muted">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
