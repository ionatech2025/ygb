import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function getOptionContainer(field: HTMLElement): HTMLElement {
  if (field.getAttribute('role') === 'combobox') {
    const list = document.getElementById(`${field.id}-listbox`);
    if (!list) {
      throw new Error(`Missing option list for #${field.id}`);
    }
    return list;
  }
  return field;
}

async function openFieldIfCollapsible(
  user: ReturnType<typeof userEvent.setup>,
  field: HTMLElement
): Promise<void> {
  if (field.getAttribute('role') === 'combobox') {
    await user.click(field);
  }
}

/** Select an option from FormSelect by its value (collapsed combobox). */
export async function chooseFormOptionByValue(
  user: ReturnType<typeof userEvent.setup>,
  fieldLabel: RegExp | string,
  value: string
): Promise<void> {
  const field = screen.getByLabelText(fieldLabel);
  await openFieldIfCollapsible(user, field);
  await user.click(within(getOptionContainer(field)).getByDisplayValue(value));
}

/** Select by element id (location cascade fields). */
export async function chooseFormOptionById(
  user: ReturnType<typeof userEvent.setup>,
  id: string,
  value: string
): Promise<void> {
  const field = document.getElementById(id);
  if (!field) {
    throw new Error(`Missing form field #${id}`);
  }
  await openFieldIfCollapsible(user, field);
  await user.click(within(getOptionContainer(field)).getByDisplayValue(value));
}

/** Select an option from FormSelect by visible label text. */
export async function chooseFormOption(
  user: ReturnType<typeof userEvent.setup>,
  fieldLabel: RegExp | string,
  optionName: RegExp | string
): Promise<void> {
  const field = screen.getByLabelText(fieldLabel);
  await openFieldIfCollapsible(user, field);
  await user.click(within(getOptionContainer(field)).getByRole('radio', { name: optionName }));
}
