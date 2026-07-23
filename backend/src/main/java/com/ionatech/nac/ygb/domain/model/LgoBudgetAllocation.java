package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.event.LgoBudgetAllocationRecorded;
import com.ionatech.nac.ygb.domain.valueobjects.PriorYearAllocationBreakdown;
import com.ionatech.nac.ygb.domain.valueobjects.Rationale;
import com.ionatech.nac.ygb.domain.valueobjects.Recommendation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class LgoBudgetAllocation {

    private final UUID lbaId;
    private final UUID submissionId;
    private final Map<String, Object> previousFyAllocations;
    private final String rationale;
    private final String recommendations;
    private final LocalDateTime submittedAt;
    private final List<LgoBudgetAllocationRecorded> domainEvents = new ArrayList<>();

    private LgoBudgetAllocation(
            UUID lbaId,
            UUID submissionId,
            Map<String, Object> previousFyAllocations,
            String rationale,
            String recommendations,
            LocalDateTime submittedAt
    ) {
        this.lbaId = lbaId;
        this.submissionId = submissionId;
        this.previousFyAllocations = Map.copyOf(previousFyAllocations);
        this.rationale = rationale;
        this.recommendations = recommendations;
        this.submittedAt = submittedAt;
    }

    public static LgoBudgetAllocation recordNew(
            UUID submissionId,
            PriorYearAllocationBreakdown previousFyAllocations,
            Rationale rationale,
            Recommendation recommendations,
            LocalDateTime submittedAt
    ) {
        Objects.requireNonNull(submissionId, "Submission id cannot be null");
        Objects.requireNonNull(previousFyAllocations, "Previous FY allocations cannot be null");
        Objects.requireNonNull(rationale, "Rationale cannot be null");
        Objects.requireNonNull(recommendations, "Recommendations cannot be null");
        Objects.requireNonNull(submittedAt, "Submitted timestamp cannot be null");

        UUID lbaId = UUID.randomUUID();
        LgoBudgetAllocation allocation = new LgoBudgetAllocation(
                lbaId,
                submissionId,
                previousFyAllocations.asMap(),
                rationale.getValue(),
                recommendations.getValue(),
                submittedAt
        );
        allocation.registerEvent(new LgoBudgetAllocationRecorded(lbaId, submissionId));
        return allocation;
    }

    public static LgoBudgetAllocation rehydrate(
            UUID lbaId,
            UUID submissionId,
            Map<String, Object> previousFyAllocations,
            String rationale,
            String recommendations,
            LocalDateTime submittedAt
    ) {
        PriorYearAllocationBreakdown.validate(previousFyAllocations);
        return new LgoBudgetAllocation(lbaId, submissionId, previousFyAllocations, rationale, recommendations, submittedAt);
    }

    private void registerEvent(LgoBudgetAllocationRecorded event) {
        domainEvents.add(event);
    }

    public List<LgoBudgetAllocationRecorded> pullDomainEvents() {
        List<LgoBudgetAllocationRecorded> events = List.copyOf(domainEvents);
        domainEvents.clear();
        return events;
    }

    public UUID getLbaId() {
        return lbaId;
    }

    public UUID getSubmissionId() {
        return submissionId;
    }

    public Map<String, Object> getPreviousFyAllocations() {
        return previousFyAllocations;
    }

    public String getRationale() {
        return rationale;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
