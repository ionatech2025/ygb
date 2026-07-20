import type { BypFormFields } from '../../../../../core/domain/byp-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface BypFeedbackSectionProps {
  value: BypFormFields;
  onChange: (value: BypFormFields) => void;
  errors: Record<string, string>;
}

export function BypFeedbackSection({ value, onChange, errors }: BypFeedbackSectionProps) {
  return (
    <FormSection title="Feedback" description="Question 9">
      <NarrativeTextarea
        id="improvementSuggestion"
        label="Q9. Suggestions for improvement"
        value={value.improvementSuggestion}
        onChange={(text) => onChange({ ...value, improvementSuggestion: text })}
        required
      />
      {errors.improvementSuggestion && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.improvementSuggestion}
        </p>
      )}
    </FormSection>
  );
}
