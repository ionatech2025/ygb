package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.model.Submission;

public interface SubmitSubmissionUseCase {
    Submission submit(SubmitSubmissionCommand command);
}
