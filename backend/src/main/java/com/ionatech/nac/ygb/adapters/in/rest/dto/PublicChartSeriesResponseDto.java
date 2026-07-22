package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record PublicChartSeriesResponseDto(
        String chartType,
        List<PublicChartDataPointDto> data
) {}
