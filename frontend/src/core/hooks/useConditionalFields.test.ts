import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useConditionalFields } from './useConditionalFields';

describe('useConditionalFields', () => {
  it('clears a field when visibility toggles from true to false', () => {
    const setField = vi.fn();

    const { rerender } = renderHook(
      ({ visibility, values }) => useConditionalFields(values, setField, visibility),
      {
        initialProps: {
          values: { reason: 'Not applied' },
          visibility: { reason: true },
        },
      }
    );

    rerender({
      values: { reason: 'Not applied' },
      visibility: { reason: false },
    });

    expect(setField).toHaveBeenCalledWith('reason', undefined);
  });
});
