import {
  LGO_BUDGET_ALLOCATION_SECTORS,
  type LgoBudgetAllocationSectorId,
  type PriorYearAllocationFields,
} from '../../../../core/domain/lgo-budget-allocation-form.model';
import { FormField, formControlClassName } from '../components/forms/FormField';
import { FormSection } from '../components/forms/FormSection';

export interface LgoPriorYearAllocationsSectionProps {
  value: PriorYearAllocationFields;
  onChange: (value: PriorYearAllocationFields) => void;
  errors?: Record<string, string>;
  formError?: string;
}

export function LgoPriorYearAllocationsSection({
  value,
  onChange,
  errors = {},
  formError,
}: LgoPriorYearAllocationsSectionProps) {
  const patchSector = (sectorId: LgoBudgetAllocationSectorId, partial: Partial<PriorYearAllocationFields[LgoBudgetAllocationSectorId]>) => {
    onChange({
      ...value,
      [sectorId]: { ...value[sectorId], ...partial },
    });
  };

  return (
    <FormSection
      title="Previous financial year allocations"
      description="Enter sector amounts (UGX) and optional share of the total budget (%). At least one sector is required."
    >
      {formError && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200" role="alert">
          {formError}
        </p>
      )}

      <div className="space-y-4" data-testid="lgo-prior-year-allocations-section">
        {LGO_BUDGET_ALLOCATION_SECTORS.map((sector) => {
          const amountError = errors[`allocation-${sector.id}-amount`];
          const percentageError = errors[`allocation-${sector.id}-percentage`];
          const row = value[sector.id];

          return (
            <div
              key={sector.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface-muted/40 p-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-end"
            >
              <p className="text-sm font-semibold text-text sm:py-2">{sector.label}</p>

              <FormField
                label="Amount (UGX)"
                htmlFor={`allocation-${sector.id}-amount`}
                error={amountError}
              >
                <input
                  id={`allocation-${sector.id}-amount`}
                  type="text"
                  inputMode="numeric"
                  value={row.amount}
                  onChange={(event) => patchSector(sector.id, { amount: event.target.value })}
                  className={formControlClassName}
                  aria-invalid={Boolean(amountError)}
                />
              </FormField>

              <FormField
                label="Share (%)"
                htmlFor={`allocation-${sector.id}-percentage`}
                error={percentageError}
              >
                <input
                  id={`allocation-${sector.id}-percentage`}
                  type="text"
                  inputMode="decimal"
                  value={row.percentage}
                  onChange={(event) => patchSector(sector.id, { percentage: event.target.value })}
                  className={formControlClassName}
                  aria-invalid={Boolean(percentageError)}
                />
              </FormField>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
