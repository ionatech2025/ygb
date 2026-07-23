package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PublicDashboardFilterOptionsRestMapper.class)
public interface BudgetPriorityDashboardRestMapper {

    BudgetPrioritySummaryResponseDto toSummaryResponse(BudgetPrioritySummary summary);

    @Mapping(target = "chartType", expression = "java(series.chartType().pathSegment())")
    BudgetPriorityChartSeriesResponseDto toChartResponse(BudgetPriorityChartSeries series);

    BudgetPriorityChartDataPointDto toDto(BudgetPriorityChartDataPoint point);

    BudgetPrioritySectionCountDto toDto(BudgetPrioritySectionCount domain);

    BudgetPriorityAreaCountDto toDto(BudgetPriorityAreaCount domain);
}
