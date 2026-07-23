package com.ionatech.nac.ygb.adapters.in.rest.dto;

import jakarta.validation.constraints.NotBlank;

public record BudgetPriorityDemographicsDto(
        @NotBlank String fullName,
        @NotBlank String phoneNumber,
        @NotBlank String ageGroup,
        @NotBlank String gender,
        @NotBlank String districtId
) {
}
