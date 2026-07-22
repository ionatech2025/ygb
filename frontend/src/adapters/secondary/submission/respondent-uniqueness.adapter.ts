import type { FormType } from '../../../core/domain/form-type.model';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';
import type { IRespondentUniquenessPort } from '../../../ports/respondent-uniqueness.port';
import { submissionDb } from './submission-queue.db';

const ACTIVE_UNIQUENESS_STATUSES = new Set<PendingSubmission['status']>(['PENDING', 'SYNCED']);

export class RespondentUniquenessAdapter implements IRespondentUniquenessPort {
  async existsLocalDuplicate(
    formType: FormType,
    respondentPhone: string,
    financialYearPeriod: string,
    excludeDeviceSubmissionId?: string
  ): Promise<boolean> {
    const duplicate = await this.findLocalDuplicate(formType, respondentPhone, financialYearPeriod);
    if (!duplicate) return false;
    if (excludeDeviceSubmissionId && duplicate.deviceSubmissionId === excludeDeviceSubmissionId) {
      return false;
    }
    return true;
  }

  async findLocalDuplicate(
    formType: FormType,
    respondentPhone: string,
    financialYearPeriod: string
  ): Promise<PendingSubmission | null> {
    const phone = normalizeUgandaPhoneLocal(respondentPhone);
    const matches = await submissionDb.pendingSubmissions
      .where('[formType+respondentPhone+financialYearPeriod]')
      .equals([formType, phone, financialYearPeriod])
      .toArray();

    return matches.find((entry) => ACTIVE_UNIQUENESS_STATUSES.has(entry.status)) ?? null;
  }
}

export const respondentUniqueness = new RespondentUniquenessAdapter();
