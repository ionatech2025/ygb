package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class DashboardFilterRequestMapper {

    public DashboardFilter toFilter(
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            FormType formType,
            LocalDate dateFrom,
            LocalDate dateTo,
            String gender,
            String ageGroup,
            UUID collectorId,
            String financialYearPeriod
    ) {
        return new DashboardFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                collectorId,
                financialYearPeriod
        );
    }
}
