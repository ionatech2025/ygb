package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record LgoBudgetAllocationRespondentDto(
        @NotBlank String name,
        @NotBlank String phone,
        @NotBlank String gender,
        @NotNull AgeGroup ageGroup,
        @NotNull UUID districtId,
        @NotNull UUID subcountyId,
        @NotNull UUID parishId,
        @NotNull UUID villageId
) {
}
