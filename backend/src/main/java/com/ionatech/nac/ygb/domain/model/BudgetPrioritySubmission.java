package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.event.BudgetPrioritySubmitted;
import com.ionatech.nac.ygb.domain.valueobjects.FinancialYearPeriod;
import com.ionatech.nac.ygb.domain.valueobjects.PhoneNumber;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class BudgetPrioritySubmission {
    private final UUID bpId;
    private final PhoneNumber phoneNumber;
    private final BudgetPrioritySection section;
    private final Map<String, Object> priorityAreas;
    private final Map<String, Object> demographicData;
    private final FinancialYearPeriod financialYearPeriod;
    private final LocalDateTime submittedAt;
    private final List<BudgetPrioritySubmitted> domainEvents = new ArrayList<>();

    private BudgetPrioritySubmission(
            UUID bpId,
            PhoneNumber phoneNumber,
            BudgetPrioritySection section,
            Map<String, Object> priorityAreas,
            Map<String, Object> demographicData,
            FinancialYearPeriod financialYearPeriod,
            LocalDateTime submittedAt
    ) {
        this.bpId = bpId;
        this.phoneNumber = phoneNumber;
        this.section = section;
        this.priorityAreas = Map.copyOf(priorityAreas);
        this.demographicData = Map.copyOf(demographicData);
        this.financialYearPeriod = financialYearPeriod;
        this.submittedAt = submittedAt;
    }

    public static BudgetPrioritySubmission recordNew(
            BudgetPrioritySection section,
            PhoneNumber phoneNumber,
            Map<String, Object> priorityAreas,
            Map<String, Object> demographicData,
            LocalDateTime submittedAt
    ) {
        Objects.requireNonNull(section, "Section cannot be null");
        Objects.requireNonNull(phoneNumber, "Phone number cannot be null");
        Objects.requireNonNull(submittedAt, "Submitted timestamp cannot be null");
        if (priorityAreas == null || priorityAreas.isEmpty()) {
            throw new IllegalArgumentException("Priority areas cannot be null or empty");
        }
        if (demographicData == null || demographicData.isEmpty()) {
            throw new IllegalArgumentException("Demographic data cannot be null or empty");
        }

        FinancialYearPeriod financialYearPeriod = FinancialYearPeriod.from(submittedAt);
        UUID bpId = UUID.randomUUID();
        BudgetPrioritySubmission submission = new BudgetPrioritySubmission(
                bpId,
                phoneNumber,
                section,
                priorityAreas,
                demographicData,
                financialYearPeriod,
                submittedAt
        );
        submission.registerEvent(new BudgetPrioritySubmitted(bpId, section, financialYearPeriod.toString()));
        return submission;
    }

    public static BudgetPrioritySubmission rehydrate(
            UUID bpId,
            PhoneNumber phoneNumber,
            BudgetPrioritySection section,
            Map<String, Object> priorityAreas,
            Map<String, Object> demographicData,
            FinancialYearPeriod financialYearPeriod,
            LocalDateTime submittedAt
    ) {
        return new BudgetPrioritySubmission(
                bpId,
                phoneNumber,
                section,
                priorityAreas,
                demographicData,
                financialYearPeriod,
                submittedAt
        );
    }

    private void registerEvent(BudgetPrioritySubmitted event) {
        domainEvents.add(event);
    }

    public List<BudgetPrioritySubmitted> pullDomainEvents() {
        List<BudgetPrioritySubmitted> events = List.copyOf(domainEvents);
        domainEvents.clear();
        return events;
    }

    public UUID getBpId() {
        return bpId;
    }

    public PhoneNumber getPhoneNumber() {
        return phoneNumber;
    }

    public BudgetPrioritySection getSection() {
        return section;
    }

    public Map<String, Object> getPriorityAreas() {
        return priorityAreas;
    }

    public Map<String, Object> getDemographicData() {
        return demographicData;
    }

    public FinancialYearPeriod getFinancialYearPeriod() {
        return financialYearPeriod;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
