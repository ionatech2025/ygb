package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record LgoBudgetAllocationChartSeriesResponseDto(
        String chartType,
        List<BudgetPriorityChartDataPointDto> data
) {}
