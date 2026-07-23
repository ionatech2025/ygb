package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record LgoBudgetAllocationResponseDto(
        UUID submissionId,
        UUID lbaId,
        String status
) {
}
