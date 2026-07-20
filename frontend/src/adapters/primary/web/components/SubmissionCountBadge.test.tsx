import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmissionCountBadge } from './SubmissionCountBadge';
import { useSubmissionCountStore } from '../../../../core/store/useSubmissionCountStore';

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { isOnline: boolean; getAccessToken: () => null }) => unknown) =>
    selector({ isOnline: false, getAccessToken: () => null }),
}));

describe('SubmissionCountBadge', () => {
  beforeEach(() => {
    useSubmissionCountStore.setState({
      todayCount: 0,
      dayKey: '2026-07-20',
      initialized: true,
    });
  });

  it('shows Today: 0 on fresh session', () => {
    render(<SubmissionCountBadge />);
    expect(screen.getByTestId('submission-count-badge')).toHaveTextContent('0');
  });

  it('shows Today: 3 after 3 local enqueues (TC-FORM-13-01)', () => {
    useSubmissionCountStore.setState({ todayCount: 3 });
    render(<SubmissionCountBadge />);
    expect(screen.getByTestId('submission-count-badge')).toHaveTextContent('3');
  });

  it('increments offline before sync completes (TC-FORM-13-02)', () => {
    render(<SubmissionCountBadge />);

    act(() => {
      useSubmissionCountStore.getState().recordSubmission();
    });
    expect(screen.getByTestId('submission-count-badge')).toHaveTextContent('1');

    act(() => {
      useSubmissionCountStore.getState().recordSubmission();
      useSubmissionCountStore.getState().recordSubmission();
    });
    expect(screen.getByTestId('submission-count-badge')).toHaveTextContent('3');
  });
});
