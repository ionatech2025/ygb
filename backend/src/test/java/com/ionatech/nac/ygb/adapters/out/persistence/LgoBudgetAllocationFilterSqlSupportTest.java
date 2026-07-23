package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.domain.valueobjects.LgoBudgetAllocationDashboardFilter;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class LgoBudgetAllocationFilterSqlSupportTest {

    @Test
    void shouldBuildWhereClauseWithLocationAndDateFilters() {
        Map<String, Object> params = new HashMap<>();
        UUID districtId = UUID.randomUUID();

        String clause = LgoBudgetAllocationFilterSqlSupport.whereClause(
                new LgoBudgetAllocationDashboardFilter(
                        districtId,
                        null,
                        null,
                        LocalDate.of(2026, 3, 1),
                        LocalDate.of(2026, 3, 31),
                        "FEMALE",
                        "AGE_30_AND_ABOVE",
                        "JAN_JUN_2026"
                ),
                params
        );

        assertThat(clause).contains("s.form_type = 'LGO_BUDGET_ALLOCATION'");
        assertThat(clause).contains("s.district_id = :districtId");
        assertThat(clause).contains("s.respondent_gender = :gender");
        assertThat(clause).contains("lba.submitted_at >= :dateFrom");
        assertThat(params).containsEntry("districtId", districtId);
        assertThat(params).containsEntry("gender", "FEMALE");
    }
}
