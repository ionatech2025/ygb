import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('hides password by default and toggles visibility', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<PasswordInput id="password" value="secret123" onChange={onChange} />);

    const input = screen.getByDisplayValue('secret123');
    expect(input).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('exposes an accessible, keyboard-operable toggle button', async () => {
    const user = userEvent.setup();

    render(<PasswordInput id="login-password" value="" onChange={() => undefined} />);

    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    toggle.focus();
    expect(toggle).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });
});
