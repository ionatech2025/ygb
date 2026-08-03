package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class BypSubmissionRequestDto extends SubmissionRequestDto {
    private String fundReceiptDuration;
    private String fundReceiptDurationSpecify;
    private Boolean receivedActualAmountRequested;
    private Long cashAmountReceived;
    private String fundsReceiptWaitAfterApplied;
    private String moneyUsedFor;
    private String instalmentPeriod;
    private String instalmentPeriodSpecify;
    private Rating serviceRating;
    private Boolean loanRepaid;
    private String loanRepaymentDuration;
    private Rating performanceRating;
    private Boolean groupOrganizedTransparently;
    private Boolean receivedBds;
    private List<String> bdsServices;
    private String improvementSuggestion;

    public BypSubmissionRequestDto() {}

    public BypSubmissionRequestDto(
            String formType,
            UUID deviceSubmissionId,
            LocalDateTime formCompletedAt,
            UUID districtId,
            UUID subcountyId,
            UUID parishId,
            UUID villageId,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            String fundReceiptDuration,
            String fundReceiptDurationSpecify,
            Boolean receivedActualAmountRequested,
            Long cashAmountReceived,
            String fundsReceiptWaitAfterApplied,
            String moneyUsedFor,
            String instalmentPeriod,
            String instalmentPeriodSpecify,
            Rating serviceRating,
            Boolean loanRepaid,
            String loanRepaymentDuration,
            Rating performanceRating,
            Boolean groupOrganizedTransparently,
            Boolean receivedBds,
            List<String> bdsServices,
            String improvementSuggestion
    ) {
        super(formType, deviceSubmissionId, formCompletedAt, districtId, subcountyId, parishId, villageId, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
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
        this.bdsServices = bdsServices;
        this.improvementSuggestion = improvementSuggestion;
    }

    public String getFundReceiptDuration() { return fundReceiptDuration; }
    public String getFundReceiptDurationSpecify() { return fundReceiptDurationSpecify; }
    public Boolean getReceivedActualAmountRequested() { return receivedActualAmountRequested; }
    public Long getCashAmountReceived() { return cashAmountReceived; }
    public String getFundsReceiptWaitAfterApplied() { return fundsReceiptWaitAfterApplied; }
    public String getMoneyUsedFor() { return moneyUsedFor; }
    public String getInstalmentPeriod() { return instalmentPeriod; }
    public String getInstalmentPeriodSpecify() { return instalmentPeriodSpecify; }
    public Rating getServiceRating() { return serviceRating; }
    public Boolean getLoanRepaid() { return loanRepaid; }
    public String getLoanRepaymentDuration() { return loanRepaymentDuration; }
    public Rating getPerformanceRating() { return performanceRating; }
    public Boolean getGroupOrganizedTransparently() { return groupOrganizedTransparently; }
    public Boolean getReceivedBds() { return receivedBds; }
    public List<String> getBdsServices() { return bdsServices; }
    public String getImprovementSuggestion() { return improvementSuggestion; }
}
