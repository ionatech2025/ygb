export type FormType = 'BYP' | 'IYP' | 'LGO' | 'PC' | 'LGO_BUDGET_ALLOCATION';

/** User-facing name for the LGO_BUDGET_ALLOCATION form type. */
export const LG_BUDGET_ALLOCATION_LABEL = 'LG Budget Allocation';

export const FORM_TYPE_OPTIONS: ReadonlyArray<{ value: FormType; label: string }> = [
  { value: 'BYP', label: 'Beneficiary Young Person (BYP)' },
  { value: 'IYP', label: 'Individual Young Person (IYP)' },
  { value: 'LGO', label: 'Local Government Official (LGO)' },
  { value: 'PC', label: 'Parish Chief (PC)' },
] as const;

export const FORM_TYPE_LABELS: Record<FormType, string> = {
  BYP: 'BYP',
  IYP: 'IYP',
  LGO: 'LGO',
  PC: 'PC',
  LGO_BUDGET_ALLOCATION: LG_BUDGET_ALLOCATION_LABEL,
};

/** Full display label for dashboards and detail views (includes budget allocation). */
export function formatFormTypeDisplayLabel(formType: string): string {
  const fromOptions = FORM_TYPE_OPTIONS.find((option) => option.value === formType)?.label;
  if (fromOptions) {
    return fromOptions;
  }
  return FORM_TYPE_LABELS[formType as FormType] ?? formType;
}
