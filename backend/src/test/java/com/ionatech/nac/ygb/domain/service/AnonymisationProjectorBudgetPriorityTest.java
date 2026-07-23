package com.ionatech.nac.ygb.domain.service;

import com.ionatech.nac.ygb.domain.exceptions.PublicPiiExposureException;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityAreaCount;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartDataPoint;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartSeries;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityChartType;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPrioritySectionCount;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPrioritySummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AnonymisationProjectorBudgetPriorityTest {

    private AnonymisationProjector projector;

    @BeforeEach
    void setUp() {
        projector = new AnonymisationProjector();
    }

    @Test
    void shouldRejectPiiKeysInBudgetPriorityResponses() {
        assertThatThrownBy(() -> projector.assertNoPiiJsonKeys(List.of("totalSubmissions", "phoneNumber")))
                .isInstanceOf(PublicPiiExposureException.class)
                .hasMessageContaining("phoneNumber");
    }

    @Test
    void shouldAllowBudgetPrioritySummaryFields() {
        BudgetPrioritySummary summary = new BudgetPrioritySummary(
                2L,
                List.of(new BudgetPrioritySectionCount("health", 2L)),
                List.of(new BudgetPriorityAreaCount("PRIMARY_HEALTH_CARE", 2L))
        );

        assertThat(projector.assertAnonymisedBudgetPrioritySummary(summary).totalSubmissions()).isEqualTo(2L);
    }

    @Test
    void shouldRejectPhoneLikePriorityAreaLabels() {
        BudgetPrioritySummary summary = new BudgetPrioritySummary(
                1L,
                List.of(),
                List.of(new BudgetPriorityAreaCount("0772123456", 1L))
        );

        assertThatThrownBy(() -> projector.assertAnonymisedBudgetPrioritySummary(summary))
                .isInstanceOf(PublicPiiExposureException.class);
    }

    @Test
    void shouldRejectPhoneLikeChartLabels() {
        BudgetPriorityChartSeries series = new BudgetPriorityChartSeries(
                BudgetPriorityChartType.BY_PRIORITY_AREA,
                List.of(new BudgetPriorityChartDataPoint("07721234567", null, 1L))
        );

        assertThatThrownBy(() -> projector.assertAnonymisedBudgetPriorityChartSeries(series))
                .isInstanceOf(PublicPiiExposureException.class);
    }
}
