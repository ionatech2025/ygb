package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySection;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPriorityDashboardFilterTest {

    @Test
    void emptyFilterShouldHaveNoActiveCriteria() {
        assertThat(BudgetPriorityDashboardFilter.empty().hasActiveCriteria()).isFalse();
    }

    @Test
    void shouldRejectDateFromAfterDateTo() {
        assertThatThrownBy(() -> new BudgetPriorityDashboardFilter(
                null, null, null, null,
                LocalDate.of(2026, 3, 20),
                LocalDate.of(2026, 3, 1),
                null, null, null
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dateFrom");
    }

    @Test
    void shouldTrackActiveCriteria() {
        BudgetPriorityDashboardFilter filter = new BudgetPriorityDashboardFilter(
                BudgetPrioritySection.HEALTH,
                UUID.randomUUID(),
                null,
                null,
                null,
                null,
                "FEMALE",
                null,
                "JAN_JUN_2026"
        );

        assertThat(filter.hasActiveCriteria()).isTrue();
    }
}
