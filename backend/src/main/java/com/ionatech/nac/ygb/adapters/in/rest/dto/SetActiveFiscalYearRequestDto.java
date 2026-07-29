package com.ionatech.nac.ygb.adapters.in.rest.dto;

import jakarta.validation.constraints.NotBlank;

public record SetActiveFiscalYearRequestDto(
        @NotBlank String fiscalYearLabel
) {}
