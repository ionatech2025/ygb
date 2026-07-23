import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LgoBudgetAllocationSuccessBanner } from './LgoBudgetAllocationSuccessBanner';

describe('LgoBudgetAllocationSuccessBanner', () => {
  it('shows offline saved locally copy', () => {
    render(<LgoBudgetAllocationSuccessBanner isOnline={false} />);
    expect(screen.getByTestId('lgo-budget-allocation-success-banner')).toHaveTextContent(/saved locally/i);
  });

  it('shows online syncing copy', () => {
    render(<LgoBudgetAllocationSuccessBanner isOnline={true} />);
    expect(screen.getByTestId('lgo-budget-allocation-success-banner')).toHaveTextContent(/syncing to the server/i);
  });
});
