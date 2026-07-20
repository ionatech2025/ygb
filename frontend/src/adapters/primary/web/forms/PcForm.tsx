import { useState } from 'react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../core/domain/respondent-fields.model';
import { RespondentSection } from '../components/forms';

export function PcForm() {
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);

  return (
    <div className="space-y-4" data-testid="pc-form">
      <h3 className="text-sm font-bold text-text">Parish Chief (PC) Questionnaire</h3>
      <RespondentSection value={respondent} onChange={setRespondent} />
      <p className="text-xs text-text-muted">Form-specific questions coming in issue 012.</p>
    </div>
  );
}
