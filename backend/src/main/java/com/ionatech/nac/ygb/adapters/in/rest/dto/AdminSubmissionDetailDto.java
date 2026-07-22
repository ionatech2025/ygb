package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminSubmissionDetailDto(
        UUID id,
        UUID collectorId,
        String collectorName,
        String status,
        LocalDateTime formCompletedAt,
        LocalDateTime syncedAt,
        String financialYearPeriod,
        SubmissionRequestDto payload
) {
}
