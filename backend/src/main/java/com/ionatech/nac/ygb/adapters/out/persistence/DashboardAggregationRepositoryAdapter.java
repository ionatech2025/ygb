package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.application.ports.spi.DashboardAggregationRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DashboardAggregationRepositoryAdapter implements DashboardAggregationRepositoryPort {

    private final DashboardAggregationJpaRepository jpaRepository;

    public DashboardAggregationRepositoryAdapter(DashboardAggregationJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public long countTotal(DashboardFilter filter) {
        return jpaRepository.countTotal(filter);
    }

    @Override
    public List<DistrictCount> countByDistrict(DashboardFilter filter) {
        return jpaRepository.countByDistrict(filter);
    }

    @Override
    public List<GenderCount> countByGender(DashboardFilter filter) {
        return jpaRepository.countByGender(filter);
    }

    @Override
    public List<TimeSeriesPoint> countOverTime(DashboardFilter filter, TimeSeriesGranularity granularity) {
        return jpaRepository.countOverTime(filter, granularity);
    }

    @Override
    public List<FormTypeCount> countByFormType(DashboardFilter filter) {
        return jpaRepository.countByFormType(filter);
    }

    @Override
    public List<FinancialYearPeriodCount> countByFinancialYearPeriod(DashboardFilter filter) {
        return jpaRepository.countByFinancialYearPeriod(filter);
    }
}
