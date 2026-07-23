package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PublicDashboardFilterOptionsRestMapper.class)
public interface LgoBudgetAllocationDashboardRestMapper {

    LgoBudgetAllocationSummaryResponseDto toSummaryResponse(LgoBudgetAllocationSummary summary);

    @Mapping(target = "chartType", expression = "java(series.chartType().pathSegment())")
    LgoBudgetAllocationChartSeriesResponseDto toChartResponse(LgoBudgetAllocationChartSeries series);

    BudgetPriorityChartDataPointDto toDto(BudgetPriorityChartDataPoint point);

    LgoBudgetAllocationDistrictCountDto toDto(LgoBudgetAllocationDistrictCount domain);

    LgoBudgetAllocationSectorCountDto toDto(LgoBudgetAllocationSectorCount domain);

    LgoBudgetAllocationFilterOptionsResponseDto toFilterOptionsResponse(LgoBudgetAllocationFilterOptions options);
}
