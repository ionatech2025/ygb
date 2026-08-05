package com.ionatech.nac.ygb.adapters.in.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterDownloadProfileRequestDto(
        @NotBlank String email,
        String optionalName,
        @NotBlank String countryCode,
        @NotBlank String gender,
        @NotBlank String ageGroup,
        @NotBlank String fieldOfOperation,
        String fieldOfOperationSpecify,
        @NotNull Boolean consentGiven
) {
}
