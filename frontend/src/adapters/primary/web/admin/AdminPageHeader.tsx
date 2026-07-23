import type { ReactNode } from 'react';
import { adminDashboardClasses } from '../../../../core/domain/admin-dashboard.theme';

export interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  testId?: string;
}

export function AdminPageHeader({ eyebrow, title, description, icon, testId }: AdminPageHeaderProps) {
  return (
    <header data-testid={testId} className={adminDashboardClasses.hero}>
      <span className={adminDashboardClasses.heroAccent} aria-hidden="true" />
      <span className={adminDashboardClasses.heroGlow} aria-hidden="true" />
      <div className={adminDashboardClasses.heroContent}>
        {eyebrow ? <p className={adminDashboardClasses.heroEyebrow}>{eyebrow}</p> : null}
        <h1 className={`${adminDashboardClasses.heroTitle} flex items-center gap-3`}>
          {icon ? <span className="shrink-0 text-brand">{icon}</span> : null}
          {title}
        </h1>
        <p className={adminDashboardClasses.heroLead}>{description}</p>
      </div>
    </header>
  );
}
