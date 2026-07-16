package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.Submission;

public interface SubmissionRepositoryPort {
    Submission save(Submission submission);
}
