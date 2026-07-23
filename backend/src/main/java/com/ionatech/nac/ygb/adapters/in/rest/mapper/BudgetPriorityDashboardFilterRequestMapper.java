package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class BudgetPriorityDashboardFilterRequestMapper {

    public BudgetPriorityDashboardFilter toFilter(
            String section,
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            LocalDate dateFrom,
            LocalDate dateTo,
            String gender,
            String ageGroup,
            String financialYearPeriod
    ) {
        BudgetPrioritySection resolvedSection = section == null || section.isBlank()
                ? null
                : BudgetPrioritySection.fromApiSegment(section);
        return new BudgetPriorityDashboardFilter(
                resolvedSection,
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
