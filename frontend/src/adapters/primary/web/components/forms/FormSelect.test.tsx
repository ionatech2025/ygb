import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';

const OPTIONS = [
  { value: 'BYP', label: 'Beneficiary Young Person (BYP)' },
  { value: 'IYP', label: 'Individual Young Person (IYP)' },
] as const;

describe('FormSelect', () => {
  it('keeps options collapsed until the combobox is opened', async () => {
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

    expect(screen.getByRole('combobox', { name: /respondent category/i })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: /Beneficiary Young Person \(BYP\)/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: /respondent category/i }));
    await user.click(screen.getByRole('radio', { name: /Individual Young Person \(IYP\)/i }));
    expect(onChange).toHaveBeenCalledWith('IYP');
    expect(screen.queryByTestId('pdm-category-option-list')).not.toBeInTheDocument();
  });

  it('renders the option panel as a fixed overlay that does not expand inline layout', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <FormSelect id="overlay-select" value="" onChange={() => undefined} options={OPTIONS} />
        <p data-testid="below-field">Field below</p>
      </div>
    );

    const belowField = screen.getByTestId('below-field');
    const layoutBefore = belowField.getBoundingClientRect().top;

    await user.click(screen.getByRole('combobox'));
    const list = screen.getByTestId('overlay-select-option-list');

    expect(list.parentElement).toBe(document.body);
    expect(list.style.position).toBe('fixed');
    expect(belowField.getBoundingClientRect().top).toBe(layoutBefore);
  });

  it('wraps long option labels within a narrow viewport container', async () => {
    const user = userEvent.setup();

    render(
      <div className="w-[320px]">
        <FormSelect id="narrow-select" value="" onChange={() => undefined} options={OPTIONS} />
      </div>
    );

    await user.click(screen.getByRole('combobox'));
    const label = screen.getByText('Beneficiary Young Person (BYP)');
    expect(label).toHaveClass('break-words');
  });

  it('scrolls inside the panel when the option list is long', async () => {
    const user = userEvent.setup();
    const longOptions = Array.from({ length: 30 }, (_, index) => ({
      value: `opt-${index}`,
      label: `Option ${index + 1}`,
    }));

    render(
      <FormField label="District" htmlFor="district-scroll">
        <FormSelect id="district-scroll" value="" onChange={() => undefined} options={longOptions} />
      </FormField>
    );

    await user.click(screen.getByRole('combobox', { name: /district/i }));
    const list = screen.getByTestId('district-scroll-option-list');
    expect(list).toHaveClass('overflow-y-auto');
    expect(within(list).getAllByRole('radio')).toHaveLength(30);
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <FormSelect id="outside-select" value="" onChange={() => undefined} options={OPTIONS} />
        <button type="button">Outside</button>
      </div>
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByTestId('outside-select-option-list')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByTestId('outside-select-option-list')).not.toBeInTheDocument();
  });
});
