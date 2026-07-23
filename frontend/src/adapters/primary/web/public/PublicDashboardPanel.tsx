import type { ReactNode } from 'react';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';

export interface PublicDashboardPanelProps {
  title: string;
  testId?: string;
  children: ReactNode;
  className?: string;
}

export function PublicDashboardPanel({
  title,
  testId,
  children,
  className,
}: PublicDashboardPanelProps) {
  return (
    <article data-testid={testId} className={`${publicDashboardClasses.chartPanel} ${className ?? ''}`}>
      <h3 className={publicDashboardClasses.chartPanelTitle}>
        <span className={publicDashboardClasses.chartPanelAccent} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </article>
  );
}

export interface PublicDashboardSectionProps {
  title: string;
  icon?: ReactNode;
  testId?: string;
  children: ReactNode;
  className?: string;
}

export function PublicDashboardSection({
  title,
  icon,
  testId,
  children,
  className,
}: PublicDashboardSectionProps) {
  return (
    <section data-testid={testId} className={`${publicDashboardClasses.section} ${className ?? ''}`}>
      <h2 className={publicDashboardClasses.sectionHeading}>
        {icon ? <span className={publicDashboardClasses.sectionHeadingIcon}>{icon}</span> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}
