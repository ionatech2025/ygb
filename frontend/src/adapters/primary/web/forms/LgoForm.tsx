import { useState } from 'react';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../core/domain/respondent-fields.model';
import { RespondentSection } from '../components/forms';

export function LgoForm() {
  const [respondent, setRespondent] = useState(EMPTY_RESPONDENT_FIELDS);

  return (
    <div className="space-y-4" data-testid="lgo-form">
      <h3 className="text-sm font-bold text-text">Local Government Official (LGO) Questionnaire</h3>
      <RespondentSection value={respondent} onChange={setRespondent} />
      <p className="text-xs text-text-muted">Form-specific questions coming in issue 011.</p>
    </div>
  );
}
