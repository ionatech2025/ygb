import {
  LGO_BUDGET_ALLOCATION_SECTORS,
  type LgoBudgetAllocationSectorId,
  type PriorYearAllocationFields,
} from '../../../../core/domain/lgo-budget-allocation-form.model';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
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
        <p className={lgoBudgetAllocationClasses.errorAlert} role="alert">
          {formError}
        </p>
      )}

      <div className="space-y-4" data-testid="lgo-prior-year-allocations-section">
        {LGO_BUDGET_ALLOCATION_SECTORS.map((sector) => {
          const amountError = errors[`allocation-${sector.id}-amount`];
          const percentageError = errors[`allocation-${sector.id}-percentage`];
          const row = value[sector.id];

          return (
            <div key={sector.id} className={lgoBudgetAllocationClasses.sectorAllocationRow}>
              <p className={lgoBudgetAllocationClasses.sectorAllocationLabel}>{sector.label}</p>

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
