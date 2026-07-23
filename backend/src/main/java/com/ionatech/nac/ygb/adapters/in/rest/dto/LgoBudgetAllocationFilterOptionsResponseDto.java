package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record LgoBudgetAllocationFilterOptionsResponseDto(
        List<FilterLocationOptionDto> districts,
        List<FilterLocationOptionDto> subcounties,
        List<FilterLocationOptionDto> parishes,
        List<String> genders,
        List<String> ageGroups,
        List<String> financialYearPeriods
) {}
