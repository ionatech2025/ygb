package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;

public interface DashboardAggregationRepositoryPort {
    long countTotal(DashboardFilter filter);

    List<DistrictCount> countByDistrict(DashboardFilter filter);

    List<GenderCount> countByGender(DashboardFilter filter);

    List<TimeSeriesPoint> countOverTime(DashboardFilter filter, TimeSeriesGranularity granularity);

    List<FormTypeCount> countByFormType(DashboardFilter filter);

    List<FinancialYearPeriodCount> countByFinancialYearPeriod(DashboardFilter filter);

    List<AgeGroupCount> countByAgeGroup(DashboardFilter filter);

    List<HeatmapEntry> countHeatmap(DashboardFilter filter);
}
