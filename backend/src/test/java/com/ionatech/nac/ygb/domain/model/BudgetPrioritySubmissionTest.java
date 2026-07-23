package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.event.BudgetPrioritySubmitted;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BudgetPrioritySubmissionTest {

    private static final Map<String, Object> SAMPLE_PRIORITY_AREAS = Map.of(
            "rankedAreas", List.of("PRIMARY_HEALTH_CARE", "MATERNAL_HEALTH")
    );

    private static final Map<String, Object> SAMPLE_DEMOGRAPHICS = Map.of(
            "fullName", "Jane Nakato",
            "phoneNumber", "0772123456",
            "gender", "FEMALE",
            "ageGroup", "AGE_20_24",
            "districtId", UUID.randomUUID().toString()
    );

    @Test
    void shouldRecordNewSubmissionWithDerivedFinancialYearPeriodAndDomainEvent() {
        LocalDateTime submittedAt = LocalDateTime.of(2026, 3, 15, 10, 0);

        BudgetPrioritySubmission submission = BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                SAMPLE_PRIORITY_AREAS,
                SAMPLE_DEMOGRAPHICS,
                submittedAt
        );

        assertThat(submission.getBpId()).isNotNull();
        assertThat(submission.getPhoneNumber().getValue()).isEqualTo("0772123456");
        assertThat(submission.getSection()).isEqualTo(BudgetPrioritySection.HEALTH);
        assertThat(submission.getPriorityAreas()).containsEntry("rankedAreas", List.of("PRIMARY_HEALTH_CARE", "MATERNAL_HEALTH"));
        assertThat(submission.getDemographicData())
                .containsEntry("fullName", "Jane Nakato")
                .containsEntry("gender", "FEMALE")
                .containsEntry("ageGroup", "AGE_20_24");
        assertThat(submission.getFinancialYearPeriod().toString()).isEqualTo("JAN_JUN_2026");
        assertThat(submission.getSubmittedAt()).isEqualTo(submittedAt);

        assertThat(submission.pullDomainEvents()).containsExactly(
                new BudgetPrioritySubmitted(submission.getBpId(), BudgetPrioritySection.HEALTH, "JAN_JUN_2026")
        );
        assertThat(submission.pullDomainEvents()).isEmpty();
    }

    @Test
    void shouldRejectEmptyPriorityAreas() {
        assertThatThrownBy(() -> BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                Map.of(),
                SAMPLE_DEMOGRAPHICS,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Priority areas");
    }

    @Test
    void shouldRejectEmptyDemographicData() {
        assertThatThrownBy(() -> BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                SAMPLE_PRIORITY_AREAS,
                Map.of(),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Demographic data");
    }

    @Test
    void shouldRejectMissingRequiredDemographicField() {
        Map<String, Object> incompleteDemographics = Map.of(
                "fullName", "Jane Nakato",
                "phoneNumber", "0772123456",
                "gender", "FEMALE",
                "ageGroup", "AGE_20_24"
        );

        assertThatThrownBy(() -> BudgetPrioritySubmission.recordNew(
                BudgetPrioritySection.HEALTH,
                PhoneNumber.of("0772123456"),
                SAMPLE_PRIORITY_AREAS,
                incompleteDemographics,
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("districtId");
    }
}
