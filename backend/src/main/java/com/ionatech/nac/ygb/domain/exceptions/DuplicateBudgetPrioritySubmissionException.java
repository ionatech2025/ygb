package com.ionatech.nac.ygb.domain.exceptions;

public class DuplicateBudgetPrioritySubmissionException extends RuntimeException {
    public DuplicateBudgetPrioritySubmissionException(String message) {
        super(message);
    }

    public DuplicateBudgetPrioritySubmissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
