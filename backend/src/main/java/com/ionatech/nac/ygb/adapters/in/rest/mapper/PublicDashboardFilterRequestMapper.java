package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDashboardFilter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class PublicDashboardFilterRequestMapper {

    public PublicDashboardFilter toFilter(
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            FormType formType,
            LocalDate dateFrom,
            LocalDate dateTo,
            String gender,
            String ageGroup,
            String financialYearPeriod
    ) {
        return new PublicDashboardFilter(
                districtId,
                subcountyId,
                parishId,
                formType,
                dateFrom,
                dateTo,
                gender,
                ageGroup,
                financialYearPeriod
        );
    }
}
