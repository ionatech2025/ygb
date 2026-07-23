package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record BudgetPriorityChartSeriesResponseDto(
        String chartType,
        List<BudgetPriorityChartDataPointDto> data
) {}
