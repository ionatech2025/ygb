import {
  requiresEconomicTransformationExplanation,
  requiresFundsSpentExplanation,
  type LgoFormFields,
} from '../../../../../core/domain/lgo-form.model';
import { FormSection, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface LgoExplainSectionProps {
  value: LgoFormFields;
  onChange: (value: LgoFormFields) => void;
  errors: Record<string, string>;
}

export function LgoExplainSection({ value, onChange, errors }: LgoExplainSectionProps) {
  const patch = (partial: Partial<LgoFormFields>) => onChange({ ...value, ...partial });
  const showFundsExplain = requiresFundsSpentExplanation(value.fundsSpentAsRequired);
  const showTransformExplain = requiresEconomicTransformationExplanation(value.economicTransformation);

  return (
    <FormSection title="Accountability & impact" description="Questions 8–9">
      <YesNoRadioGroup
        name="fundsSpentAsRequired"
        label="Q8. Are allocated funds to the PDM Programme in the district/city/sub-county/town council being spent as required?"
        value={value.fundsSpentAsRequired}
        onChange={(choice) =>
          patch({
            fundsSpentAsRequired: choice,
            fundsSpentExplanation: choice ? '' : value.fundsSpentExplanation,
          })
        }
        required
        error={errors.fundsSpentAsRequired}
      />

      {showFundsExplain && (
        <>
          <NarrativeTextarea
            id="fundsSpentExplanation"
            label="Explain why funds were not spent as required"
            value={value.fundsSpentExplanation}
            onChange={(text) => patch({ fundsSpentExplanation: text })}
            required
          />
          {errors.fundsSpentExplanation && (
            <p className="text-[11px] text-rose-600" role="alert">
              {errors.fundsSpentExplanation}
            </p>
          )}
        </>
      )}

      <YesNoRadioGroup
        name="economicTransformation"
        label="Q9. Is resource spent on the PDM Programme translating into moving beneficiary young people into the money economy?"
        value={value.economicTransformation}
        onChange={(choice) =>
          patch({
            economicTransformation: choice,
            economicTransformationExplanation: choice ? '' : value.economicTransformationExplanation,
          })
        }
        required
        error={errors.economicTransformation}
      />

      {showTransformExplain && (
        <>
          <NarrativeTextarea
            id="economicTransformationExplanation"
            label="Explain why PDM has not translated into economic transformation"
            value={value.economicTransformationExplanation}
            onChange={(text) => patch({ economicTransformationExplanation: text })}
            required
          />
          {errors.economicTransformationExplanation && (
            <p className="text-[11px] text-rose-600" role="alert">
              {errors.economicTransformationExplanation}
            </p>
          )}
        </>
      )}
    </FormSection>
  );
}
