import type { LgoFormFields } from '../../../../../core/domain/lgo-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface LgoFeedbackSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
}

export function LgoFeedbackSection({ value, onChange, errors }: LgoFeedbackSectionProps) {
  return (
    <FormSection title="Feedback" description="Question 10">
      <NarrativeTextarea
        id="improvementSuggestion"
        label="Q10. Suggestions for improvement"
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
