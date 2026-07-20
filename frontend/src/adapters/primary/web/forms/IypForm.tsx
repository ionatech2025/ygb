import { useState } from 'react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../core/domain/respondent-fields.model';
import { RespondentSection } from '../components/forms';

export function IypForm() {
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);

  return (
    <div className="space-y-4" data-testid="iyp-form">
      <h3 className="text-sm font-bold text-text">Individual Young Person (IYP) Questionnaire</h3>
      <RespondentSection value={respondent} onChange={setRespondent} />
      <p className="text-xs text-text-muted">Form-specific questions coming in issue 010.</p>
    </div>
  );
}
