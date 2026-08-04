package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PublicVisitBeaconRequestDto(
        @NotBlank String anonymousSessionId,
        @NotBlank String routeGroup
) {
}
