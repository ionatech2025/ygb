import type { BudgetPrioritySection } from '../core/domain/budget-priority-section.model';
import type {
  BudgetPrioritySubmissionPayload,
  BudgetPrioritySubmissionResult,
} from '../core/domain/budget-priority-submission.model';

export interface IBudgetPriorityApiPort {
  submit(
    section: BudgetPrioritySection,
    payload: BudgetPrioritySubmissionPayload
  ): Promise<BudgetPrioritySubmissionResult>;
}
