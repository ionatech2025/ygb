import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';

const OPTIONS = [
  { value: 'BYP', label: 'Beneficiary Young Person (BYP)' },
  { value: 'IYP', label: 'Individual Young Person (IYP)' },
] as const;

describe('FormSelect', () => {
  it('renders options, exposes accessible label, and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FormField label="Respondent category" htmlFor="pdm-category" required>
        <FormSelect
          id="pdm-category"
          value=""
          onChange={onChange}
          options={OPTIONS}
          placeholder="Select a category…"
          required
        />
      </FormField>
    );

    expect(screen.getByLabelText(/respondent category/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Beneficiary Young Person \(BYP\)/i })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /Individual Young Person \(IYP\)/i }));
    expect(onChange).toHaveBeenCalledWith('IYP');
  });

  it('wraps long option labels within a narrow viewport container', () => {
    render(
      <div className="w-[320px]">
        <FormSelect id="narrow-select" value="" onChange={() => undefined} options={OPTIONS} />
      </div>
    );

    const label = screen.getByText('Beneficiary Young Person (BYP)');
    expect(label).toHaveClass('break-words');
    expect(label.scrollWidth).toBeLessThanOrEqual(320);
  });

  it('supports collapsible mode for long lists', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FormField label="District" htmlFor="district">
        <FormSelect
          id="district"
          value=""
          onChange={onChange}
          options={[
            { value: 'd1', label: 'Kampala' },
            { value: 'd2', label: 'Ntungamo' },
          ]}
          collapsible
          placeholder="Select district…"
        />
      </FormField>
    );

    expect(screen.queryByRole('radio', { name: 'Kampala' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: /district/i }));
    await user.click(screen.getByRole('radio', { name: 'Kampala' }));
    expect(onChange).toHaveBeenCalledWith('d1');
  });
});
