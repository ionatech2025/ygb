import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { FormField, formControlClassName } from '../components/forms/FormField';
import { FormSection } from '../components/forms/FormSection';

export interface LgoRecommendationsSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function LgoRecommendationsSection({ value, onChange, error }: LgoRecommendationsSectionProps) {
  return (
    <FormSection
      title="Recommendations"
      description="What should change in the coming financial year?"
    >
      <FormField label="Budget recommendations" htmlFor="lgoRecommendations" required error={error}>
        <textarea
          id="lgoRecommendations"
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${formControlClassName} ${lgoBudgetAllocationClasses.textArea}`}
          aria-invalid={Boolean(error)}
          data-testid="lgo-recommendations-section"
        />
      </FormField>
    </FormSection>
  );
}
