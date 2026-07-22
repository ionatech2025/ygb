package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetSubmissionDetailQuery;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.SubmissionNotFoundException;
import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;

import java.util.UUID;

public class GetSubmissionDetailService implements GetSubmissionDetailQuery {

    private final SubmissionRepositoryPort submissionRepositoryPort;

    public GetSubmissionDetailService(SubmissionRepositoryPort submissionRepositoryPort) {
        this.submissionRepositoryPort = submissionRepositoryPort;
    }

    @Override
    public AdminSubmissionDetail getById(UUID id) {
        return submissionRepositoryPort.findDetailById(id)
                .orElseThrow(() -> new SubmissionNotFoundException(id));
    }
}
