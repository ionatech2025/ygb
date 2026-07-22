package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DashboardFilterTest {

    @Test
    void emptyFilterShouldHaveNoActiveCriteria() {
        DashboardFilter filter = DashboardFilter.empty();

        assertThat(filter.hasActiveCriteria()).isFalse();
    }

    @Test
    void shouldCombineOptionalCriteriaWithAndSemantics() {
        UUID districtId = UUID.randomUUID();
        DashboardFilter filter = new DashboardFilter(
                districtId,
                null,
                null,
                FormType.BYP,
                null,
                null,
                "FEMALE",
                null,
                null,
                "JAN_JUN_2026"
        );

        assertThat(filter.hasActiveCriteria()).isTrue();
        assertThat(filter.districtId()).isEqualTo(districtId);
        assertThat(filter.formType()).isEqualTo(FormType.BYP);
        assertThat(filter.gender()).isEqualTo("FEMALE");
        assertThat(filter.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
    }

    @Test
    void shouldRejectInvalidDateRange() {
        LocalDate from = LocalDate.of(2026, 6, 1);
        LocalDate to = LocalDate.of(2026, 3, 1);

        assertThatThrownBy(() -> new DashboardFilter(null, null, null, null, from, to, null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dateFrom must not be after dateTo");
    }
}
