export interface ActiveFiscalYearSetting {
  fiscalYearLabel: string;
  priorFiscalYearLabel: string | null;
  supportedLabels: string[];
}

export const DEFAULT_ACTIVE_FISCAL_YEAR_LABEL = '2025/26';
