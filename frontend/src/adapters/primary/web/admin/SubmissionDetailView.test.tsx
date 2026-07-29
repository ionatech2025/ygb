import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FormType } from '../../../../core/domain/form-type.model';
import type { SubmissionDetail } from '../../../../core/domain/submission-admin.model';
import { SubmissionDetailView } from './SubmissionDetailView';

const COLLECTOR_ID = '22222222-2222-2222-2222-222222222222';
const COLLECTOR_NAME = 'Default Collector';

function createDetail(formType: FormType): SubmissionDetail {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    collectorId: COLLECTOR_ID,
    collectorName: COLLECTOR_NAME,
    status: 'SYNCED',
    formCompletedAt: '2026-03-15T10:00:00',
    syncedAt: '2026-03-15T10:05:00',
    financialYearPeriod: 'JAN_JUN_2026',
    payload: {
      formType,
      respondentName: 'Test Respondent',
      deviceSubmissionId: '33333333-3333-3333-3333-333333333333',
      formCompletedAt: '2026-03-15T10:00:00',
    },
  };
}

describe('SubmissionDetailView enumerator attribution', () => {
  it.each(['BYP', 'IYP', 'LGO', 'PC'] as const)(
    'renders collector name, collector id, form type, and timestamps for %s',
    (formType) => {
      render(<SubmissionDetailView detail={createDetail(formType)} />);

      expect(screen.getByText(COLLECTOR_NAME)).toBeInTheDocument();
      expect(screen.getByText(COLLECTOR_ID)).toBeInTheDocument();
      expect(screen.getByText('Completed at')).toBeInTheDocument();
      expect(screen.getByText('Synced at')).toBeInTheDocument();
      expect(screen.getByText('Form type')).toBeInTheDocument();
    }
  );
});
