export type FormType = 'BYP' | 'IYP' | 'LGO' | 'PC';

export const FORM_TYPE_OPTIONS: ReadonlyArray<{ value: FormType; label: string }> = [
  { value: 'BYP', label: 'Beneficiary Young Person (BYP)' },
  { value: 'IYP', label: 'Individual Young Person (IYP)' },
  { value: 'LGO', label: 'Local Government Official (LGO)' },
  { value: 'PC', label: 'Parish Chief (PC)' },
] as const;
