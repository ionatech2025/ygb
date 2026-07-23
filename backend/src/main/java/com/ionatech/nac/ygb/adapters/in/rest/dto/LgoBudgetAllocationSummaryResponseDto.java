package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record LgoBudgetAllocationSummaryResponseDto(
        long totalSubmissions,
        List<LgoBudgetAllocationDistrictCountDto> byDistrict,
        List<LgoBudgetAllocationSectorCountDto> topSectors
) {}
