package com.ionatech.nac.ygb.adapters.in.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterDownloadProfileRequestDto(
        @NotBlank String email,
        String optionalName,
        @NotBlank String countryCode,
        @NotBlank String gender,
        @NotBlank String ageGroup,
        @NotBlank String fieldOfOperation,
        String fieldOfOperationSpecify,
        @Size(max = 2000) String improvementFeedback,
        @NotNull Boolean consentGiven
) {
}
