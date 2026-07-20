import type { ReactNode } from 'react';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-4">
      <header className="space-y-1 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
