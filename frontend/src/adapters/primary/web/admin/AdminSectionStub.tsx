interface AdminSectionStubProps {
  title: string;
  description: string;
  issueRef: string;
}

export function AdminSectionStub({ title, description, issueRef }: AdminSectionStubProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-4" data-testid="admin-section-stub">
      <div>
        <h2 className="text-lg font-bold text-text sm:text-xl">{title}</h2>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-text-muted">
        Coming in {issueRef}
      </div>
    </div>
  );
}
