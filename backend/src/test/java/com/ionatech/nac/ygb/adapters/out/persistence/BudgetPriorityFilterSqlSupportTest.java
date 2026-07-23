package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class BudgetPriorityFilterSqlSupportTest {

    @Test
    void shouldBuildWhereClauseWithSectionAndDemographicFilters() {
        Map<String, Object> params = new HashMap<>();
        BudgetPriorityDashboardFilter filter = new BudgetPriorityDashboardFilter(
                BudgetPrioritySection.HEALTH,
                UUID.randomUUID(),
                null,
                null,
                LocalDate.of(2026, 3, 1),
                LocalDate.of(2026, 3, 31),
                "FEMALE",
                "AGE_20_24",
                "JAN_JUN_2026"
        );

        String whereClause = BudgetPriorityFilterSqlSupport.whereClause(filter, params);

        assertThat(whereClause).contains("bps.section = :section");
        assertThat(whereClause).contains("demographic_data->>'districtId'");
        assertThat(whereClause).contains("demographic_data->>'gender'");
        assertThat(whereClause).contains("bps.submitted_at >=");
        assertThat(params).containsKeys("section", "districtId", "gender", "ageGroup", "financialYearPeriod");
    }

    @Test
    void emptyFilterShouldOnlyContainBasePredicate() {
        Map<String, Object> params = new HashMap<>();

        String whereClause = BudgetPriorityFilterSqlSupport.whereClause(BudgetPriorityDashboardFilter.empty(), params);

        assertThat(whereClause).isEqualTo(" WHERE 1=1 ");
        assertThat(params).isEmpty();
    }
}
