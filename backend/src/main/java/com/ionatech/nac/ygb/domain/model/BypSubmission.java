package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.UUID;

public class BypSubmission extends Submission {
    private final Age exactAge;
    private final String fundReceiptDuration;
    private final String fundReceiptDurationSpecify;
    private final Boolean receivedActualAmountRequested;
    private final Long cashAmountReceived;
    private final String instalmentPeriod;
    private final String instalmentPeriodSpecify;
    private final Rating serviceRating;
    private final Rating performanceRating;
    private final Boolean groupOrganizedTransparently;
    private final Boolean receivedBds;
    private final List<String> bdsServices;
    private final NarrativeText improvementSuggestion;

    public BypSubmission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            Age exactAge,
            String fundReceiptDuration,
            String fundReceiptDurationSpecify,
            Boolean receivedActualAmountRequested,
            Long cashAmountReceived,
            String instalmentPeriod,
            String instalmentPeriodSpecify,
            Rating serviceRating,
            Rating performanceRating,
            Boolean groupOrganizedTransparently,
            Boolean receivedBds,
            List<String> bdsServices,
            NarrativeText improvementSuggestion
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        
        if (exactAge == null) {
            throw new IllegalArgumentException("Exact age is required");
        }
        if (fundReceiptDuration == null || fundReceiptDuration.trim().isEmpty()) {
            throw new IllegalArgumentException("Fund receipt duration is required");
        }
        if (receivedActualAmountRequested == null) {
            throw new IllegalArgumentException("Received actual amount requested is required");
        }
        if (cashAmountReceived == null || cashAmountReceived < 0) {
            throw new IllegalArgumentException("Cash amount received is required and must be positive");
        }
        if (instalmentPeriod == null || instalmentPeriod.trim().isEmpty()) {
            throw new IllegalArgumentException("Instalment period is required");
        }
        if (serviceRating == null) {
            throw new IllegalArgumentException("Service rating is required");
        }
        if (performanceRating == null) {
            throw new IllegalArgumentException("Performance rating is required");
        }
        if (groupOrganizedTransparently == null) {
            throw new IllegalArgumentException("Group organized transparently is required");
        }
        if (receivedBds == null) {
            throw new IllegalArgumentException("Received BDS is required");
        }
        if (improvementSuggestion == null) {
            throw new IllegalArgumentException("Improvement suggestion is required");
        }

        this.exactAge = exactAge;
        this.fundReceiptDuration = fundReceiptDuration;
        this.fundReceiptDurationSpecify = fundReceiptDurationSpecify;
        this.receivedActualAmountRequested = receivedActualAmountRequested;
        this.cashAmountReceived = cashAmountReceived;
        this.instalmentPeriod = instalmentPeriod;
        this.instalmentPeriodSpecify = instalmentPeriodSpecify;
        this.serviceRating = serviceRating;
        this.performanceRating = performanceRating;
        this.groupOrganizedTransparently = groupOrganizedTransparently;
        this.receivedBds = receivedBds;
        this.bdsServices = bdsServices == null ? List.of() : List.copyOf(bdsServices);
        this.improvementSuggestion = improvementSuggestion;
    }

    public Age getExactAge() {
        return exactAge;
    }

    public String getFundReceiptDuration() {
        return fundReceiptDuration;
    }

    public String getFundReceiptDurationSpecify() {
        return fundReceiptDurationSpecify;
    }

    public Boolean getReceivedActualAmountRequested() {
        return receivedActualAmountRequested;
    }

    public Long getCashAmountReceived() {
        return cashAmountReceived;
    }

    public String getInstalmentPeriod() {
        return instalmentPeriod;
    }

    public String getInstalmentPeriodSpecify() {
        return instalmentPeriodSpecify;
    }

    public Rating getServiceRating() {
        return serviceRating;
    }

    public Rating getPerformanceRating() {
        return performanceRating;
    }

    public Boolean getGroupOrganizedTransparently() {
        return groupOrganizedTransparently;
    }

    public Boolean getReceivedBds() {
        return receivedBds;
    }

    public List<String> getBdsServices() {
        return bdsServices;
    }

    public NarrativeText getImprovementSuggestion() {
        return improvementSuggestion;
    }

    @Override
    public FormType getFormType() {
        return FormType.BYP;
    }

    @Override
    public void validate() {
        if ("MORE_THAN_WEEK_LESS_THAN_MONTH".equals(fundReceiptDuration) || "MONTHS".equals(fundReceiptDuration)) {
            if (fundReceiptDurationSpecify == null || fundReceiptDurationSpecify.trim().length() < 10) {
                throw new IllegalArgumentException("fundReceiptDurationSpecify is required when duration is " + fundReceiptDuration + " and must be at least 10 chars");
            }
        }
        if ("OTHERS".equals(instalmentPeriod)) {
            if (instalmentPeriodSpecify == null || instalmentPeriodSpecify.trim().length() < 10) {
                throw new IllegalArgumentException("instalmentPeriodSpecify is required when period is OTHERS and must be at least 10 chars");
            }
        }
        if (Boolean.TRUE.equals(receivedBds)) {
            if (bdsServices.isEmpty()) {
                throw new IllegalArgumentException("BDS services list cannot be empty when receivedBds is true");
            }
        }
    }
}
