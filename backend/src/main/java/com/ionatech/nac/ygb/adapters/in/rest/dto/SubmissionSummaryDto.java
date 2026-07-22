package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.model.FormType;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionSummaryDto(
        UUID id,
        FormType formType,
        String respondentName,
        UUID districtId,
        String districtName,
        UUID collectorId,
        String collectorName,
        LocalDateTime formCompletedAt,
        LocalDateTime syncedAt,
        String status,
        String financialYearPeriod
) {
}
