package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record ActiveFiscalYearSettingResponseDto(
        String fiscalYearLabel,
        String priorFiscalYearLabel,
        List<String> supportedLabels
) {}
