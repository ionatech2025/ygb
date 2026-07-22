package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.UUID;

public record PublicHeatmapEntryDto(
        UUID districtId,
        UUID parishId,
        String label,
        long count
) {}
