import type { IypFormFields } from '../../../../../core/domain/iyp-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface IypFeedbackSectionProps {
  value: IypFormFields;
  onChange: (value: IypFormFields) => void;
  errors: Record<string, string>;
}

export function IypFeedbackSection({ value, onChange, errors }: IypFeedbackSectionProps) {
  return (
    <FormSection title="Feedback" description="Improvement suggestion">
      <NarrativeTextarea
        id="improvementSuggestion"
        label="Suggestions for improvement"
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
