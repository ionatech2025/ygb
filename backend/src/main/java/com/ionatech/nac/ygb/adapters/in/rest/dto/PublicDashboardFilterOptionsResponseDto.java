package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record PublicDashboardFilterOptionsResponseDto(
        List<FilterLocationOptionDto> districts,
        List<FilterLocationOptionDto> subcounties,
        List<FilterLocationOptionDto> parishes,
        List<String> formTypes,
        List<String> genders,
        List<String> ageGroups,
        List<String> financialYearPeriods,
        List<String> programmeAreas
) {}
