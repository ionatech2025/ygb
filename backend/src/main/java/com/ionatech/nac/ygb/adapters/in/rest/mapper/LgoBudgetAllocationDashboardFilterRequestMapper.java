package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class LgoBudgetAllocationDashboardFilterRequestMapper {

    public LgoBudgetAllocationDashboardFilter toFilter(
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            LocalDate dateFrom,
            LocalDate dateTo,
            String gender,
            String ageGroup,
            String financialYearPeriod
    ) {
        return new LgoBudgetAllocationDashboardFilter(
                districtId,
                subcountyId,
                parishId,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                financialYearPeriod
        );
    }
}
