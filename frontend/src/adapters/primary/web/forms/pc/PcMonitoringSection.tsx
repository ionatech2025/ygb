import {
  MONITORED_BY_OPTIONS,
  MONITORED_BY_OTHER_VALUE,
  type PcFormFields,
} from '../../../../../core/domain/pc-form.model';
import { FormSection, MultiCheckboxGroup, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface PcMonitoringSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcMonitoringSection({ value, onChange, errors }: PcMonitoringSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Monitoring & Oversight" description="Who monitored the programme and how">
      <MultiCheckboxGroup
        legend="Who monitored the programme?"
        options={MONITORED_BY_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        selected={value.monitoredBy}
        onChange={(selected) =>
          patch({
            monitoredBy: selected as PcFormFields['monitoredBy'],
            monitoredByOthersSpecify: selected.includes(MONITORED_BY_OTHER_VALUE)
              ? value.monitoredByOthersSpecify
              : '',
          })
        }
        otherOptionValue={MONITORED_BY_OTHER_VALUE}
        otherSpecifyValue={value.monitoredByOthersSpecify}
        onOtherSpecifyChange={(text) => patch({ monitoredByOthersSpecify: text })}
        otherSpecifyLabel="Specify who monitored the programme"
        otherSpecifyError={errors.monitoredByOthersSpecify}
        required
        error={errors.monitoredBy}
      />

      <NarrativeTextarea
        id="monitoringMethod"
        label="Monitoring method"
        value={value.monitoringMethod}
        onChange={(text) => patch({ monitoringMethod: text })}
        required
      />
      {errors.monitoringMethod && (
        <p className="text-[11px] text-rose-600" role="alert">
          {errors.monitoringMethod}
        </p>
      )}

      <YesNoRadioGroup
        name="reportSharedWithRespondent"
        label="Was the monitoring report shared with the respondent?"
        value={value.reportSharedWithRespondent}
        onChange={(choice) => patch({ reportSharedWithRespondent: choice })}
        required
        error={errors.reportSharedWithRespondent}
      />
    </FormSection>
  );
}
