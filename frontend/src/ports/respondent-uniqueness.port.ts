import type { PendingSubmission } from '../core/domain/pending-submission.model';
import type { FormType } from '../core/domain/form-type.model';

export interface IRespondentUniquenessPort {
  existsLocalDuplicate(
    formType: FormType,
    respondentPhone: string,
    financialYearPeriod: string,
    excludeDeviceSubmissionId?: string
  ): Promise<boolean>;

  findLocalDuplicate(
    formType: FormType,
    respondentPhone: string,
    financialYearPeriod: string
  ): Promise<PendingSubmission | null>;
}
