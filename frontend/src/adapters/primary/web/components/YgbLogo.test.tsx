import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { YgbLogo } from './YgbLogo';

describe('YgbLogo', () => {
  it('renders the official lockup with accessible alt text', () => {
    render(<YgbLogo />);

    const logo = screen.getByRole('img', { name: 'Youth Go Budget' });
    expect(logo).toHaveAttribute('src', '/ygb_logo.png');
    expect(logo).toHaveClass('h-10');
  });

  it('supports a taller login size', () => {
    render(<YgbLogo heightClassName="h-14" />);
    expect(screen.getByRole('img', { name: 'Youth Go Budget' })).toHaveClass('h-14');
  });
});
