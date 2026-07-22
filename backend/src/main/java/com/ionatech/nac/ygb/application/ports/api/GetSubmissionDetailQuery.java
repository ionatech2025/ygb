package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AdminSubmissionDetail;

import java.util.UUID;

public interface GetSubmissionDetailQuery {
    AdminSubmissionDetail getById(UUID id);
}
