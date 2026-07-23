package com.ionatech.nac.ygb.adapters.in.rest.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record LgoBudgetAllocationRequestDto(
        @NotNull UUID deviceSubmissionId,
        @NotNull LocalDateTime formCompletedAt,
        @NotNull @Valid LgoBudgetAllocationRespondentDto respondent,
        @NotEmpty Map<String, Object> priorYearAllocations,
        @NotBlank String rationale,
        @NotBlank String recommendations
) {
}
