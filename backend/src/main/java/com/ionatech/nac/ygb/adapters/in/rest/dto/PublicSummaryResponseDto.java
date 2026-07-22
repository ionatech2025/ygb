package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record PublicSummaryResponseDto(
        long totalSubmissions,
        List<FormTypeCountDto> byFormType,
        List<GenderCountDto> byGender,
        List<FinancialYearPeriodCountDto> byFinancialYearPeriod
) {}
