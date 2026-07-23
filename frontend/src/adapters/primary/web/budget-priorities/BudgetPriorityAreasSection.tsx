import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';
import { getBudgetPriorityFormConfig } from '../../../../core/domain/budget-priority-form-config';
import type { BudgetPriorityFormErrors } from '../../../../core/domain/budget-priority-validation';
import { MultiCheckboxGroup } from '../components/forms/MultiCheckboxGroup';
import { FormSection } from '../components/forms/FormSection';

export interface BudgetPriorityAreasSectionProps {
  section: BudgetPrioritySection;
  rankedAreas: string[];
  onChange: (rankedAreas: string[]) => void;
  errors?: BudgetPriorityFormErrors;
}

export function BudgetPriorityAreasSection({
  section,
  rankedAreas,
  onChange,
  errors = {},
}: BudgetPriorityAreasSectionProps) {
  const config = getBudgetPriorityFormConfig(section);

  return (
    <FormSection
      title="Priority areas"
      description="Select the budget areas that matter most to you. Choose at least one."
    >
      <MultiCheckboxGroup
        legend="Which areas should receive priority funding?"
        options={config.priorityAreas}
        selected={rankedAreas}
        onChange={onChange}
        required
        error={errors.rankedAreas}
      />
    </FormSection>
  );
}
