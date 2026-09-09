import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminTablePager } from './AdminTablePager';

describe('AdminTablePager', () => {
  it('hides controls when there is only one page', () => {
    render(
      <AdminTablePager
        page={0}
        totalPages={1}
        totalElements={3}
        onPageChange={vi.fn()}
        itemLabel="collector"
        testIdPrefix="users-pager"
      />
    );

    expect(screen.getByTestId('users-pager-total')).toHaveTextContent('3 collectors');
    expect(screen.queryByTestId('users-pager-prev-page')).not.toBeInTheDocument();
  });

  it('calls onPageChange for next and previous', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <AdminTablePager
        page={1}
        totalPages={3}
        totalElements={60}
        onPageChange={onPageChange}
        itemLabel="collector"
        testIdPrefix="users-pager"
      />
    );

    await user.click(screen.getByTestId('users-pager-next-page'));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByTestId('users-pager-prev-page'));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });
});
