import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownContent } from './MarkdownContent';

describe('MarkdownContent', () => {
  it('renders safe markdown content', () => {
    render(<MarkdownContent content={'## Safe Heading\n\nPlain paragraph text.'} />);

    expect(screen.getByRole('heading', { name: 'Safe Heading' })).toBeInTheDocument();
    expect(screen.getByText('Plain paragraph text.')).toBeInTheDocument();
  });

  it('strips unsafe script content from rendered output', () => {
    render(
      <MarkdownContent
        content={'## Unsafe\n\n<script>alert("xss")</script>\n\n<img src="x" onerror="alert(1)" />'}
      />
    );

    expect(document.querySelector('script')).toBeNull();
    expect(screen.queryByText('alert("xss")')).toBeNull();
    expect(document.querySelector('img[onerror]')).toBeNull();
  });
});
