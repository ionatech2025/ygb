package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record DashboardFilterOptionsResponseDto(
        List<FilterLocationOptionDto> districts,
        List<FilterLocationOptionDto> subcounties,
        List<FilterLocationOptionDto> parishes,
        List<String> formTypes,
        List<String> genders,
        List<String> ageGroups,
        List<FilterCollectorOptionDto> collectors,
        List<String> financialYearPeriods
) {}
