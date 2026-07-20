import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiCheckboxGroup } from './MultiCheckboxGroup';
import { MULTI_SELECT_OTHER_VALUE } from '../../../../../core/domain/form-validation.model';

const options = [
  { value: 'RADIO', label: 'Radio' },
  { value: 'TELEVISION', label: 'Television' },
  { value: MULTI_SELECT_OTHER_VALUE, label: 'Others (specify)' },
];

describe('MultiCheckboxGroup', () => {
  it('allows multiple simultaneous selections', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiCheckboxGroup
        legend="Information channels"
        options={options}
        selected={['RADIO']}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Television' }));
    expect(onChange).toHaveBeenCalledWith(['RADIO', 'TELEVISION']);
  });

  it('renders multiple checked options when selected', () => {
    render(
      <MultiCheckboxGroup
        legend="Information channels"
        options={options}
        selected={['RADIO', 'TELEVISION']}
        onChange={() => undefined}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Radio' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Television' })).toBeChecked();
  });

  it('shows and requires a specify field when Others is checked', () => {
    render(
      <MultiCheckboxGroup
        legend="Information channels"
        options={options}
        selected={[MULTI_SELECT_OTHER_VALUE]}
        onChange={() => undefined}
        onOtherSpecifyChange={() => undefined}
      />
    );

    const specifyInput = screen.getByRole('textbox', { name: /Please specify/i });
    expect(specifyInput).toBeInTheDocument();
    expect(specifyInput).toBeRequired();
  });
});
