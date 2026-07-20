import {
  requiresImprovementsSeenExplanation,
  requiresProgressReportsExplanation,
  type PcFormFields,
} from '../../../../../core/domain/pc-form.model';
import { FormField, formControlClassName, FormSection, NarrativeTextarea, YesNoRadioGroup } from '../../components/forms';

export interface PcSelfRelianceSectionProps {
  value: PcFormFields;
  onChange: (value: PcFormFields) => void;
  errors: Record<string, string>;
}

export function PcSelfRelianceSection({ value, onChange, errors }: PcSelfRelianceSectionProps) {
  const patch = (partial: Partial<PcFormFields>) => onChange({ ...value, ...partial });

  return (
    <FormSection title="Self-reliance" description="Improvements, reporting, and enterprise indicators">
      <YesNoRadioGroup
        name="improvementsSeen"
        label="Did you see improvements from PDM?"
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

      {requiresImprovementsSeenExplanation(value.improvementsSeen) && (
        <>
          <NarrativeTextarea
            id="improvementsSeenExplanation"
            label="In what areas did you see improvements?"
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

      <YesNoRadioGroup
        name="progressReportsSubmitted"
        label="Were progress reports submitted?"
        value={value.progressReportsSubmitted}
        onChange={(choice) =>
          patch({
            progressReportsSubmitted: choice,
            progressReportsSubmittedExplanation: choice ? value.progressReportsSubmittedExplanation : '',
          })
        }
        required
        error={errors.progressReportsSubmitted}
      />

      {requiresProgressReportsExplanation(value.progressReportsSubmitted) && (
        <>
          <NarrativeTextarea
            id="progressReportsSubmittedExplanation"
            label="To whom and when were reports submitted?"
            value={value.progressReportsSubmittedExplanation}
            onChange={(text) => patch({ progressReportsSubmittedExplanation: text })}
            required
          />
          {errors.progressReportsSubmittedExplanation && (
            <p className="text-[11px] text-rose-600" role="alert">
              {errors.progressReportsSubmittedExplanation}
            </p>
          )}
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Self-reliant beneficiaries count"
          htmlFor="selfRelianceBeneficiariesCount"
          required
          error={errors.selfRelianceBeneficiariesCount}
        >
          <input
            id="selfRelianceBeneficiariesCount"
            type="text"
            inputMode="numeric"
            value={value.selfRelianceBeneficiariesCount}
            onChange={(e) => patch({ selfRelianceBeneficiariesCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>

        <FormField
          label="Self-reliance group projects count"
          htmlFor="selfRelianceGroupProjectsCount"
          required
          error={errors.selfRelianceGroupProjectsCount}
        >
          <input
            id="selfRelianceGroupProjectsCount"
            type="text"
            inputMode="numeric"
            value={value.selfRelianceGroupProjectsCount}
            onChange={(e) => patch({ selfRelianceGroupProjectsCount: e.target.value })}
            className={formControlClassName}
            required
          />
        </FormField>
      </div>
    </FormSection>
  );
}
