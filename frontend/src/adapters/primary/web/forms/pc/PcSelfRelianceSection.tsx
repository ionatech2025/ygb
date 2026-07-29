import {
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
    <FormSection title="Reporting & Self-Reliance" description="Section E — Questions 21–26">
      <YesNoRadioGroup
        name="progressReportsSubmitted"
        label="Q21. Do you prepare and submit programme progress reports?"
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

      {value.progressReportsSubmitted !== true && (
        <p className="text-xs text-text-muted">Q22. If yes, to whom and when?</p>
      )}

      {requiresProgressReportsExplanation(value.progressReportsSubmitted) && (
        <>
          <NarrativeTextarea
            id="progressReportsSubmittedExplanation"
            label="Q22. If yes, to whom and when?"
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

      <FormField
        label="Q23. The number of young people who benefited from the PDM and started agricultural enterprises"
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

      <p className="text-xs text-text-muted">
        Q24. The number of young people who benefited from the PDM and had a stable income from their enterprises
        established
      </p>
      <p className="text-xs text-text-muted">
        Q25. Number of beneficiary young people trained to improve productivity, efficiency, profitability, business
        viability, and supply chain
      </p>

      <FormField
        label="Q26. The number of youth-led enterprises established with support from the PDM and remained active after the support"
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
    </FormSection>
  );
}
