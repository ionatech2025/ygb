import type {
  LgoBudgetAllocationSubmissionPayload,
  LgoBudgetAllocationSubmissionResult,
} from '../core/domain/lgo-budget-allocation-form.model';

export interface ILgoBudgetAllocationApiPort {
  submit(payload: LgoBudgetAllocationSubmissionPayload): Promise<LgoBudgetAllocationSubmissionResult>;
}
