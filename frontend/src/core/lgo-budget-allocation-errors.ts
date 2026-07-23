import { ApiError } from './api-client';

export interface MappedLgoBudgetAllocationError {
  title: string;
  message: string;
}

export function mapLgoBudgetAllocationSubmitError(error: unknown): MappedLgoBudgetAllocationError {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return {
        title: 'Session expired',
        message: 'Please sign in again. Your submission stays queued and will sync after you log back in.',
      };
    }
    if (error.status === 409) {
      return {
        title: 'Duplicate submission',
        message: error.message || 'This respondent already has a submission for the current period.',
      };
    }
    if (error.status === 400) {
      return {
        title: 'Invalid submission',
        message: error.message || 'Please review the form and try again.',
      };
    }
    if (error.status >= 500) {
      return {
        title: 'Server error',
        message: 'The server is unavailable right now. Your data is saved locally and will sync when possible.',
      };
    }
    return {
      title: 'Submission failed',
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Submission failed',
      message: error.message,
    };
  }

  return {
    title: 'Submission failed',
    message: 'Something went wrong. Please try again.',
  };
}
