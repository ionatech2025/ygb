import type { IypFormFields } from '../../../../../core/domain/iyp-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface IypFeedbackSectionProps {
  value: IypFormFields;
  onChange: (value: IypFormFields) => void;
  errors: Record<string, string>;
}

export function IypFeedbackSection({ value, onChange, errors }: IypFeedbackSectionProps) {
  return (
    <FormSection title="Closing feedback" description="Question 16">
      <NarrativeTextarea
        id="improvementSuggestion"
        label="Q16. What do you think should be improved to make the PDM programme more efficient and effective in your community?"
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
