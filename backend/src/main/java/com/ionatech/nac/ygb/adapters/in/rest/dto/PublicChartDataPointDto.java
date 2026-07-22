package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PublicChartDataPointDto(
        String label,
        UUID locationId,
        LocalDate date,
        long count
) {}
