package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public class BypSubmission extends Submission {
    private static final Set<String> LOAN_REPAYMENT_DURATIONS = Set.of(
            "ZERO_TO_SIX_MONTHS",
            "SEVEN_TO_ELEVEN_MONTHS",
            "TWELVE_TO_EIGHTEEN_MONTHS",
            "EIGHTEEN_TO_TWENTY_FOUR_MONTHS"
    );
    private static final Set<String> BDS_SERVICES = Set.of(
            "TRAINING",
            "MARKET_LINKAGES",
            "EXTENSION_SERVICE"
    );
    private static final String BDS_OTHERS_PREFIX = "OTHERS:";

    private final String fundReceiptDuration;
    private final String fundReceiptDurationSpecify;
    private final Boolean receivedActualAmountRequested;
    private final Long cashAmountReceived;
    private final NarrativeText fundsReceiptWaitAfterApplied;
    private final NarrativeText moneyUsedFor;
    private final String instalmentPeriod;
    private final String instalmentPeriodSpecify;
    private final Rating serviceRating;
    private final Boolean loanRepaid;
    private final String loanRepaymentDuration;
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
            String fundReceiptDuration,
            String fundReceiptDurationSpecify,
            Boolean receivedActualAmountRequested,
            Long cashAmountReceived,
            NarrativeText fundsReceiptWaitAfterApplied,
            NarrativeText moneyUsedFor,
            String instalmentPeriod,
            String instalmentPeriodSpecify,
            Rating serviceRating,
            Boolean loanRepaid,
            String loanRepaymentDuration,
            Rating performanceRating,
            Boolean groupOrganizedTransparently,
            Boolean receivedBds,
            List<String> bdsServices,
            NarrativeText improvementSuggestion
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);

        if (fundReceiptDuration == null || fundReceiptDuration.trim().isEmpty()) {
            throw new IllegalArgumentException("Fund receipt duration is required");
        }
        if (receivedActualAmountRequested == null) {
            throw new IllegalArgumentException("Received actual amount requested is required");
        }
        if (cashAmountReceived == null || cashAmountReceived < 0) {
            throw new IllegalArgumentException("Cash amount received is required and must be positive");
        }
        if (fundsReceiptWaitAfterApplied == null) {
            throw new IllegalArgumentException("Funds receipt wait after applied is required");
        }
        if (moneyUsedFor == null) {
            throw new IllegalArgumentException("Money used for is required");
        }
        if (serviceRating == null) {
            throw new IllegalArgumentException("Service rating is required");
        }
        if (loanRepaid == null) {
            throw new IllegalArgumentException("Loan repaid is required");
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

        this.fundReceiptDuration = fundReceiptDuration;
        this.fundReceiptDurationSpecify = fundReceiptDurationSpecify;
        this.receivedActualAmountRequested = receivedActualAmountRequested;
        this.cashAmountReceived = cashAmountReceived;
        this.fundsReceiptWaitAfterApplied = fundsReceiptWaitAfterApplied;
        this.moneyUsedFor = moneyUsedFor;
        this.instalmentPeriod = instalmentPeriod;
        this.instalmentPeriodSpecify = instalmentPeriodSpecify;
        this.serviceRating = serviceRating;
        this.loanRepaid = loanRepaid;
        this.loanRepaymentDuration = loanRepaymentDuration;
        this.performanceRating = performanceRating;
        this.groupOrganizedTransparently = groupOrganizedTransparently;
        this.receivedBds = receivedBds;
        this.bdsServices = bdsServices == null ? List.of() : List.copyOf(bdsServices);
        this.improvementSuggestion = improvementSuggestion;
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

    public NarrativeText getFundsReceiptWaitAfterApplied() {
        return fundsReceiptWaitAfterApplied;
    }

    public NarrativeText getMoneyUsedFor() {
        return moneyUsedFor;
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

    public Boolean getLoanRepaid() {
        return loanRepaid;
    }

    public String getLoanRepaymentDuration() {
        return loanRepaymentDuration;
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
            if (fundReceiptDurationSpecify == null || fundReceiptDurationSpecify.trim().length() < NarrativeText.DURATION_MIN_LENGTH) {
                throw new IllegalArgumentException("fundReceiptDurationSpecify is required when duration is " + fundReceiptDuration + " and must be at least "
                        + NarrativeText.DURATION_MIN_LENGTH + " chars");
            }
        }
        if (instalmentPeriod != null && "OTHERS".equals(instalmentPeriod)) {
            if (instalmentPeriodSpecify == null || instalmentPeriodSpecify.trim().length() < NarrativeText.DURATION_MIN_LENGTH) {
                throw new IllegalArgumentException("instalmentPeriodSpecify is required when period is OTHERS and must be at least "
                        + NarrativeText.DURATION_MIN_LENGTH + " chars");
            }
        }
        if (Boolean.TRUE.equals(loanRepaid)) {
            if (loanRepaymentDuration == null || loanRepaymentDuration.trim().isEmpty()
                    || !LOAN_REPAYMENT_DURATIONS.contains(loanRepaymentDuration.trim())) {
                throw new IllegalArgumentException(
                        "loanRepaymentDuration is required when loanRepaid is true and must be one of "
                                + LOAN_REPAYMENT_DURATIONS);
            }
        } else if (loanRepaymentDuration != null && !loanRepaymentDuration.trim().isEmpty()) {
            throw new IllegalArgumentException("loanRepaymentDuration must be null when loanRepaid is false");
        }
        if (Boolean.TRUE.equals(receivedBds)) {
            if (bdsServices.isEmpty()) {
                throw new IllegalArgumentException("BDS services list cannot be empty when receivedBds is true");
            }
            for (String service : bdsServices) {
                if (service == null || service.isBlank()) {
                    throw new IllegalArgumentException("bdsServices entries must not be blank");
                }
                if (BDS_SERVICES.contains(service)) {
                    continue;
                }
                if (service.startsWith(BDS_OTHERS_PREFIX)) {
                    String specify = service.substring(BDS_OTHERS_PREFIX.length()).trim();
                    if (specify.isEmpty()) {
                        throw new IllegalArgumentException(
                                "bdsServices OTHERS entry must include specify text as OTHERS:<text>");
                    }
                    continue;
                }
                if ("OTHERS".equals(service)) {
                    throw new IllegalArgumentException(
                            "bdsServices OTHERS entry must include specify text as OTHERS:<text>");
                }
                throw new IllegalArgumentException("Invalid bdsServices value: " + service);
            }
        }
    }
}
