import {
  MONITORED_BY_OPTIONS,
  MONITORED_BY_OTHER_VALUE,
  requiresImprovementsSeenExplanation,
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
    <FormSection title="PDM Programme Monitoring and Oversight" description="Section D — Questions 15–20">
      <p className="text-xs text-text-muted">Q15. Did anyone monitor the programme execution in your parish?</p>

      <MultiCheckboxGroup
        legend="Q16. If yes, who monitored the programme? (select all that apply)"
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
        label="Q17. How was the monitoring carried out?"
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
        label="Q18. Was the monitoring report shared with you?"
        value={value.reportSharedWithRespondent}
        onChange={(choice) => patch({ reportSharedWithRespondent: choice })}
        required
        error={errors.reportSharedWithRespondent}
      />

      <YesNoRadioGroup
        name="improvementsSeen"
        label="Q19. Did you see any improvements in the PDM programme service delivery with the monitoring recommendations?"
        value={value.improvementsSeen}
        onChange={(choice) =>
          patch({
            improvementsSeen: choice,
            improvementsSeenExplanation: choice ? value.improvementsSeenExplanation : '',
          })
        }
        required
        error={errors.improvementsSeen}
      />

      {value.improvementsSeen !== true && (
        <p className="text-xs text-text-muted">Q20. If yes, in what areas?</p>
      )}

      {requiresImprovementsSeenExplanation(value.improvementsSeen) && (
        <>
          <NarrativeTextarea
            id="improvementsSeenExplanation"
            label="Q20. If yes, in what areas?"
            value={value.improvementsSeenExplanation}
            onChange={(text) => patch({ improvementsSeenExplanation: text })}
            required
          />
          {errors.improvementsSeenExplanation && (
            <p className="text-[11px] text-rose-600" role="alert">
              {errors.improvementsSeenExplanation}
            </p>
          )}
        </>
      )}
    </FormSection>
  );
}
