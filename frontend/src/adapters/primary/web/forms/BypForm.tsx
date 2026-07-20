import { useState } from 'react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../core/domain/respondent-fields.model';
import { RespondentSection } from '../components/forms';

export function BypForm() {
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);

  return (
    <div className="space-y-4" data-testid="byp-form">
      <h3 className="text-sm font-bold text-text">Beneficiary Young Person (BYP) Questionnaire</h3>
      <RespondentSection value={respondent} onChange={setRespondent} showExactAge />
      <p className="text-xs text-text-muted">Form-specific questions coming in issue 009.</p>
    </div>
  );
}
