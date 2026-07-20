import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders a red asterisk when required', () => {
    render(
      <FormField label="Respondent Name" htmlFor="name" required>
        <input id="name" />
      </FormField>
    );

    expect(screen.getByText('*')).toHaveClass('text-rose-600');
  });
});
