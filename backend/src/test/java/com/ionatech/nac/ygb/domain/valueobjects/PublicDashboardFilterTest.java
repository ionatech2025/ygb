package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.FormType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PublicDashboardFilterTest {

    @Test
    void emptyFilterShouldHaveNoActiveCriteria() {
        assertThat(PublicDashboardFilter.empty().hasActiveCriteria()).isFalse();
    }

    @Test
    void shouldCombineOptionalCriteriaWithAndSemantics() {
        UUID districtId = UUID.randomUUID();
        PublicDashboardFilter filter = new PublicDashboardFilter(
                districtId,
                null,
                null,
                FormType.IYP,
                null,
                null,
                "FEMALE",
                "AGE_20_24",
                "JAN_JUN_2026"
        );

        assertThat(filter.hasActiveCriteria()).isTrue();
        assertThat(filter.districtId()).isEqualTo(districtId);
        assertThat(filter.formType()).isEqualTo(FormType.IYP);
        assertThat(filter.gender()).isEqualTo("FEMALE");
        assertThat(filter.ageGroup()).isEqualTo("AGE_20_24");
        assertThat(filter.financialYearPeriod()).isEqualTo("JAN_JUN_2026");
    }

    @Test
    void shouldRejectInvalidDateRange() {
        LocalDate from = LocalDate.of(2026, 6, 1);
        LocalDate to = LocalDate.of(2026, 3, 1);

        assertThatThrownBy(() -> new PublicDashboardFilter(null, null, null, null, from, to, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dateFrom must not be after dateTo");
    }

    @Test
    void shouldNotExposeCollectorDimension() {
        PublicDashboardFilter filter = PublicDashboardFilter.empty();

        assertThat(filter.getClass().getRecordComponents())
                .noneMatch(component -> component.getName().equals("collectorId"));
    }
}
