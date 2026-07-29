import type { PcFormFields } from '../../../../../core/domain/pc-form.model';
import { FormSection, NarrativeTextarea } from '../../components/forms';

export interface PcFeedbackSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcFeedbackSection({ value, onChange, errors }: PcFeedbackSectionProps) {
  return (
    <FormSection title="Closing feedback" description="Programme improvement">
      <NarrativeTextarea
        id="programmeImprovementSuggestion"
        label="What do you think should be improved to make the PDM programme more efficient and effective in your community?"
        value={value.programmeImprovementSuggestion}
        onChange={(text) => onChange({ ...value, programmeImprovementSuggestion: text })}
        required
      />
      {errors.programmeImprovementSuggestion && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.programmeImprovementSuggestion}
        </p>
      )}
    </FormSection>
  );
}
