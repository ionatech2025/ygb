import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FormType } from '../../../../core/domain/form-type.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { PdmEntryScreen } from './PdmEntryScreen';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';

describe('PdmEntryScreen', () => {
  it('selecting each respondent category calls onSelect with the correct form type', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(formType: FormType) => void>();

    render(<PdmEntryScreen onSelect={onSelect} />);

    for (const option of FORM_TYPE_OPTIONS) {
      onSelect.mockClear();
      await chooseFormOptionByValue(user, /respondent category/i, option.value);
      expect(onSelect).toHaveBeenCalledWith(option.value);
    }
  });
});
