package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record BudgetPrioritySubmissionResponseDto(
        UUID bpId,
        String status,
        String section,
        String financialYearPeriod
) {
}
