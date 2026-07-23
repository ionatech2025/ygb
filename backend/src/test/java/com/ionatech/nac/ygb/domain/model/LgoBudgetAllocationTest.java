package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.event.LgoBudgetAllocationRecorded;
import com.ionatech.nac.ygb.domain.valueobjects.PriorYearAllocationBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.Rationale;
import com.ionatech.nac.ygb.domain.valueobjects.Recommendation;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LgoBudgetAllocationTest {

    private static final Map<String, Object> SAMPLE_ALLOCATIONS = Map.of(
            "health", Map.of("amount", 1_000_000, "percentage", 25),
            "agriculture", Map.of("amount", 800_000, "percentage", 20)
    );

    private static final String SAMPLE_RATIONALE =
            "Health and agriculture were prioritised based on district disease burden and food security needs.";
    private static final String SAMPLE_RECOMMENDATIONS =
            "Increase climate adaptation funding and strengthen education infrastructure in rural parishes.";

    @Test
    void shouldRecordNewAllocationWithDomainEvent() {
        UUID submissionId = UUID.randomUUID();
        LocalDateTime submittedAt = LocalDateTime.of(2026, 3, 15, 10, 0);

        LgoBudgetAllocation allocation = LgoBudgetAllocation.recordNew(
                submissionId,
                new PriorYearAllocationBreakdown(SAMPLE_ALLOCATIONS),
                new Rationale(SAMPLE_RATIONALE),
                new Recommendation(SAMPLE_RECOMMENDATIONS),
                submittedAt
        );

        assertThat(allocation.getLbaId()).isNotNull();
        assertThat(allocation.getSubmissionId()).isEqualTo(submissionId);
        assertThat(allocation.getPreviousFyAllocations()).isEqualTo(SAMPLE_ALLOCATIONS);
        assertThat(allocation.getRationale()).isEqualTo(SAMPLE_RATIONALE);
        assertThat(allocation.getRecommendations()).isEqualTo(SAMPLE_RECOMMENDATIONS);
        assertThat(allocation.getSubmittedAt()).isEqualTo(submittedAt);

        assertThat(allocation.pullDomainEvents()).containsExactly(
                new LgoBudgetAllocationRecorded(allocation.getLbaId(), submissionId)
        );
        assertThat(allocation.pullDomainEvents()).isEmpty();
    }

    @Test
    void shouldRejectMissingSubmissionId() {
        assertThatThrownBy(() -> LgoBudgetAllocation.recordNew(
                null,
                new PriorYearAllocationBreakdown(SAMPLE_ALLOCATIONS),
                new Rationale(SAMPLE_RATIONALE),
                new Recommendation(SAMPLE_RECOMMENDATIONS),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(NullPointerException.class)
                .hasMessageContaining("Submission id");
    }

    @Test
    void shouldRejectEmptyPreviousFyAllocations() {
        assertThatThrownBy(() -> LgoBudgetAllocation.recordNew(
                UUID.randomUUID(),
                new PriorYearAllocationBreakdown(Map.of()),
                new Rationale(SAMPLE_RATIONALE),
                new Recommendation(SAMPLE_RECOMMENDATIONS),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least one sector");
    }

    @Test
    void shouldRejectBlankRationale() {
        assertThatThrownBy(() -> LgoBudgetAllocation.recordNew(
                UUID.randomUUID(),
                new PriorYearAllocationBreakdown(SAMPLE_ALLOCATIONS),
                new Rationale("   "),
                new Recommendation(SAMPLE_RECOMMENDATIONS),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("blank");
    }

    @Test
    void shouldRejectBlankRecommendations() {
        assertThatThrownBy(() -> LgoBudgetAllocation.recordNew(
                UUID.randomUUID(),
                new PriorYearAllocationBreakdown(SAMPLE_ALLOCATIONS),
                new Rationale(SAMPLE_RATIONALE),
                new Recommendation("short"),
                LocalDateTime.of(2026, 3, 15, 10, 0)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("10 characters");
    }

    @Test
    void shouldRejectNullSectorAllocationValue() {
        Map<String, Object> invalid = new HashMap<>();
        invalid.put("health", null);

        assertThatThrownBy(() -> new PriorYearAllocationBreakdown(invalid))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot be null");
    }
}
