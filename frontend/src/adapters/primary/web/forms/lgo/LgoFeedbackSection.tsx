import type { LgoFormFields } from '../../../../../core/domain/lgo-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface LgoFeedbackSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
}

export function LgoFeedbackSection({ value, onChange, errors }: LgoFeedbackSectionProps) {
  return (
    <FormSection title="Closing feedback" description="Question 10">
      <NarrativeTextarea
        id="improvementSuggestion"
        label="Q10. What do you think should be improved to make the PDM programme more efficient and effective in your community?"
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
