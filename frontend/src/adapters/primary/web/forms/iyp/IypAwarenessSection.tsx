import {
  IYP_OTHERS_OPTION_VALUE,
  INFORMATION_CHANNEL_OPTIONS,
  requiresEligibleCriteriaAware,
  requiresInformationChannels,
  type IypFormFields,
} from '../../../../../core/domain/iyp-form.model';
import { FormSection, MultiCheckboxGroup, YesNoRadioGroup } from '../../components/forms';

export interface IypAwarenessSectionProps {
  value: IypFormFields;
  onChange: (value: IypFormFields) => void;
  errors: Record<string, string>;
}

export function IypAwarenessSection({ value, onChange, errors }: IypAwarenessSectionProps) {
  const patch = (partial: Partial<IypFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Section A: PDM awareness & information" description="Questions 1–3">
      <YesNoRadioGroup
        name="awareOfPdm"
        label="Q1. Are you aware of the PDM programme in your parish or district?"
        value={value.awareOfPdm}
        onChange={(choice) =>
          patch({
            awareOfPdm: choice,
            informationChannels: choice ? value.informationChannels : [],
            informationChannelsOthersSpecify: choice ? value.informationChannelsOthersSpecify : '',
            eligibleCriteriaAware: choice ? value.eligibleCriteriaAware : null,
            appliedForFund: choice ? value.appliedForFund : null,
            accessedFund: choice ? value.accessedFund : null,
            rejectionNarrative: choice ? value.rejectionNarrative : '',
            reasonsForNotApplying: choice ? value.reasonsForNotApplying : [],
            reasonsForNotApplyingOthersSpecify: choice ? value.reasonsForNotApplyingOthersSpecify : '',
          })
        }
        required
        error={errors.awareOfPdm}
      />

      {requiresInformationChannels(value.awareOfPdm) && (
        <MultiCheckboxGroup
          legend="Q2. How did you get information about the PDM programme?"
          hint="(select all that apply)"
          options={INFORMATION_CHANNEL_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          selected={value.informationChannels}
          onChange={(selected) =>
            patch({
              informationChannels: selected as IypFormFields['informationChannels'],
              informationChannelsOthersSpecify: selected.includes(IYP_OTHERS_OPTION_VALUE)
                ? value.informationChannelsOthersSpecify
                : '',
            })
          }
          otherOptionValue={IYP_OTHERS_OPTION_VALUE}
          otherSpecifyValue={value.informationChannelsOthersSpecify}
          onOtherSpecifyChange={(text) => patch({ informationChannelsOthersSpecify: text })}
          otherSpecifyLabel="Please specify how you got information about the PDM programme"
          otherSpecifyError={errors.informationChannelsOthersSpecify}
          required
          error={errors.informationChannels}
        />
      )}

      {requiresEligibleCriteriaAware(value.awareOfPdm) && (
        <YesNoRadioGroup
          name="eligibleCriteriaAware"
          label="Q3. Are you aware of the eligibility criteria of PDM being implemented in your area?"
          value={value.eligibleCriteriaAware}
          onChange={(choice) => patch({ eligibleCriteriaAware: choice })}
          required
          error={errors.eligibleCriteriaAware}
        />
      )}
    </FormSection>
  );
}
