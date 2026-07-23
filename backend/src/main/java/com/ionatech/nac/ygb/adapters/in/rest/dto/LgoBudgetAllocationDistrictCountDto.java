package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record LgoBudgetAllocationDistrictCountDto(
        UUID districtId,
        String districtLabel,
        long count
) {}
