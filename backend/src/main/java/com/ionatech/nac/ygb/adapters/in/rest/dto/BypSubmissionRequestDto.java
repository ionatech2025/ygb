package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class BypSubmissionRequestDto extends SubmissionRequestDto {
    private int exactAge;
    private String fundReceiptDuration;
    private String fundReceiptDurationSpecify;
    private Boolean receivedActualAmountRequested;
    private Long cashAmountReceived;
    private String instalmentPeriod;
    private String instalmentPeriodSpecify;
    private Rating serviceRating;
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
            int exactAge,
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
            String improvementSuggestion
    ) {
        super(formType, deviceSubmissionId, formCompletedAt, districtId, subcountyId, parishId, villageId, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
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
        this.bdsServices = bdsServices;
        this.improvementSuggestion = improvementSuggestion;
    }

    public int getExactAge() { return exactAge; }
    public String getFundReceiptDuration() { return fundReceiptDuration; }
    public String getFundReceiptDurationSpecify() { return fundReceiptDurationSpecify; }
    public Boolean getReceivedActualAmountRequested() { return receivedActualAmountRequested; }
    public Long getCashAmountReceived() { return cashAmountReceived; }
    public String getInstalmentPeriod() { return instalmentPeriod; }
    public String getInstalmentPeriodSpecify() { return instalmentPeriodSpecify; }
    public Rating getServiceRating() { return serviceRating; }
    public Rating getPerformanceRating() { return performanceRating; }
    public Boolean getGroupOrganizedTransparently() { return groupOrganizedTransparently; }
    public Boolean getReceivedBds() { return receivedBds; }
    public List<String> getBdsServices() { return bdsServices; }
    public String getImprovementSuggestion() { return improvementSuggestion; }
}
