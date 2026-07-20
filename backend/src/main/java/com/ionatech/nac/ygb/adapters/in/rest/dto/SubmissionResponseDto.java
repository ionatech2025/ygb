package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionResponseDto(
        UUID id,
        String formType,
        String respondentName,
        String status,
        LocalDateTime formCompletedAt
) {}
