package com.ionatech.nac.ygb.domain.exceptions;

public class DuplicateSyncedSubmissionException extends RuntimeException {
    public DuplicateSyncedSubmissionException(String message) {
        super(message);
    }

    public DuplicateSyncedSubmissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
