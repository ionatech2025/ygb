import { useEffect, useRef } from 'react';

export type FieldVisibilityMap<T extends Record<string, unknown>> = Partial<
  Record<keyof T, boolean>
>;

/**
 * Clears field values when their visibility toggles from true → false (US-FORM-09).
 */
export function useConditionalFields<T extends Record<string, unknown>>(
  values: T,
  setField: (key: keyof T, value: unknown) => void,
  visibility: FieldVisibilityMap<T>
): void {
  const previousVisibility = useRef<FieldVisibilityMap<T>>({});

  useEffect(() => {
    (Object.keys(visibility) as (keyof T)[]).forEach((key) => {
      const wasVisible = previousVisibility.current[key] ?? false;
      const isVisible = visibility[key] ?? false;
      const current = values[key];

      if (wasVisible && !isVisible && current != null && current !== '') {
        setField(key, undefined);
      }
    });
    previousVisibility.current = visibility;
  }, [visibility, values, setField]);
}
