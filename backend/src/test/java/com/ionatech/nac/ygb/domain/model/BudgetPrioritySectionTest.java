package com.ionatech.nac.ygb.domain.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPrioritySectionTest {

    @Test
    void shouldParseApiSegments() {
        assertThat(BudgetPrioritySection.fromApiSegment("health")).isEqualTo(BudgetPrioritySection.HEALTH);
        assertThat(BudgetPrioritySection.fromApiSegment("agriculture")).isEqualTo(BudgetPrioritySection.AGRICULTURE);
        assertThat(BudgetPrioritySection.fromApiSegment("education")).isEqualTo(BudgetPrioritySection.EDUCATION);
        assertThat(BudgetPrioritySection.fromApiSegment("climate")).isEqualTo(BudgetPrioritySection.CLIMATE);
    }

    @Test
    void shouldExposeLowercaseApiSegments() {
        assertThat(BudgetPrioritySection.HEALTH.toApiSegment()).isEqualTo("health");
        assertThat(BudgetPrioritySection.AGRICULTURE.toApiSegment()).isEqualTo("agriculture");
        assertThat(BudgetPrioritySection.EDUCATION.toApiSegment()).isEqualTo("education");
        assertThat(BudgetPrioritySection.CLIMATE.toApiSegment()).isEqualTo("climate");
    }

    @Test
    void shouldRejectUnknownApiSegment() {
        assertThatThrownBy(() -> BudgetPrioritySection.fromApiSegment("transport"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown budget priority section");
    }
}
