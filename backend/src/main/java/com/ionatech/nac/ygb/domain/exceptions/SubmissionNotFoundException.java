package com.ionatech.nac.ygb.domain.exceptions;

import java.util.UUID;

public class SubmissionNotFoundException extends RuntimeException {
    public SubmissionNotFoundException(UUID id) {
        super("Submission not found: " + id);
    }
}
