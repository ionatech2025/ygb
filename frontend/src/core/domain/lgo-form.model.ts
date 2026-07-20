/** Supported LGO fiscal year labels — must stay aligned with backend `LgoFiscalYearCatalog`. */
export function buildLgoFiscalYearLabels(fromStartYear = 2022, toStartYear = 2029): string[] {
  const labels: string[] = [];
  for (let year = fromStartYear; year <= toStartYear; year += 1) {
    const suffix = String(year + 1).slice(-2);
    labels.push(`${year}/${suffix}`);
  }
  return labels;
}

export const LGO_FISCAL_YEAR_LABELS = buildLgoFiscalYearLabels();

export type LgoFiscalYearLabel = (typeof LGO_FISCAL_YEAR_LABELS)[number];

/** Editable string fields — parsed and validated on submit. */
export interface FiscalYearRecordFields {
  fiscalYearLabel: string;
  expectedFunds: string;
  actualFunds: string;
  totalBeneficiaryCount: string;
  youngPeopleCount: string;
  youngWomenCount: string;
  totalParishesCount: string;
  fundedParishesCount: string;
}

export interface LgoFormFields {
  selectedFiscalYearLabel: string;
  fiscalYearRecord: FiscalYearRecordFields;
  fundsAllocatedEquitably: boolean | null;
  allocatedFundsSufficient: boolean | null;
  adequateUtilisationOversight: boolean | null;
  transparentBeneficiarySelection: boolean | null;
  fundsSpentAsRequired: boolean | null;
  fundsSpentExplanation: string;
  economicTransformation: boolean | null;
  economicTransformationExplanation: string;
  improvementSuggestion: string;
}

export function createEmptyFiscalYearRecord(label: string): FiscalYearRecordFields {
  return {
    fiscalYearLabel: label,
    expectedFunds: '',
    actualFunds: '',
    totalBeneficiaryCount: '',
    youngPeopleCount: '',
    youngWomenCount: '',
    totalParishesCount: '',
    fundedParishesCount: '',
  };
}

export const EMPTY_LGO_FIELDS: LgoFormFields = {
  selectedFiscalYearLabel: '',
  fiscalYearRecord: createEmptyFiscalYearRecord(''),
  fundsAllocatedEquitably: null,
  allocatedFundsSufficient: null,
  adequateUtilisationOversight: null,
  transparentBeneficiarySelection: null,
  fundsSpentAsRequired: null,
  fundsSpentExplanation: '',
  economicTransformation: null,
  economicTransformationExplanation: '',
  improvementSuggestion: '',
};

export function requiresFundsSpentExplanation(fundsSpentAsRequired: boolean | null): boolean {
  return fundsSpentAsRequired === false;
}

export function requiresEconomicTransformationExplanation(economicTransformation: boolean | null): boolean {
  return economicTransformation === false;
}

export function fiscalYearFieldId(label: string, field: keyof Omit<FiscalYearRecordFields, 'fiscalYearLabel'>): string {
  const slug = label ? label.replace('/', '-') : 'selected';
  return `${field}-${slug}`;
}
