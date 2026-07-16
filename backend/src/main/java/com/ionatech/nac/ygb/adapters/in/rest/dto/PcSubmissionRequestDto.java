package com.ionatech.nac.ygb.adapters.in.rest.dto;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PcSubmissionRequestDto extends SubmissionRequestDto {
    private Long amountExpected;
    private Long amountReceived;
    private Integer totalBeneficiaries;
    private Integer youthBeneficiaries;
    private Integer youngWomenBeneficiaries;
    private String obstaclesDescription;
    private Boolean spendingTargetedToMostInNeed;
    private Integer pdcTotalMembers;
    private Integer pdcYouthMembers;
    private Integer pdcWomenMembers;
    private Boolean pdcTrainingReceived;
    private List<String> pdcTrainingAreas;
    private String pdcEffectivenessRating;
    private List<String> monitoredBy;
    private String monitoredByOthersSpecify;
    private String monitoringMethod;
    private Boolean reportSharedWithRespondent;
    private Boolean improvementsSeen;
    private String improvementsSeenExplanation;
    private Boolean progressReportsSubmitted;
    private String progressReportsSubmittedExplanation;
    private Integer selfRelianceBeneficiariesCount;
    private Integer selfRelianceGroupProjectsCount;

    public PcSubmissionRequestDto() {}

    public PcSubmissionRequestDto(
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
            Long amountExpected,
            Long amountReceived,
            Integer totalBeneficiaries,
            Integer youthBeneficiaries,
            Integer youngWomenBeneficiaries,
            String obstaclesDescription,
            Boolean spendingTargetedToMostInNeed,
            Integer pdcTotalMembers,
            Integer pdcYouthMembers,
            Integer pdcWomenMembers,
            Boolean pdcTrainingReceived,
            List<String> pdcTrainingAreas,
            String pdcEffectivenessRating,
            List<String> monitoredBy,
            String monitoredByOthersSpecify,
            String monitoringMethod,
            Boolean reportSharedWithRespondent,
            Boolean improvementsSeen,
            String improvementsSeenExplanation,
            Boolean progressReportsSubmitted,
            String progressReportsSubmittedExplanation,
            Integer selfRelianceBeneficiariesCount,
            Integer selfRelianceGroupProjectsCount
    ) {
        super(formType, deviceSubmissionId, formCompletedAt, districtId, subcountyId, parishId, villageId, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        this.amountExpected = amountExpected;
        this.amountReceived = amountReceived;
        this.totalBeneficiaries = totalBeneficiaries;
        this.youthBeneficiaries = youthBeneficiaries;
        this.youngWomenBeneficiaries = youngWomenBeneficiaries;
        this.obstaclesDescription = obstaclesDescription;
        this.spendingTargetedToMostInNeed = spendingTargetedToMostInNeed;
        this.pdcTotalMembers = pdcTotalMembers;
        this.pdcYouthMembers = pdcYouthMembers;
        this.pdcWomenMembers = pdcWomenMembers;
        this.pdcTrainingReceived = pdcTrainingReceived;
        this.pdcTrainingAreas = pdcTrainingAreas;
        this.pdcEffectivenessRating = pdcEffectivenessRating;
        this.monitoredBy = monitoredBy;
        this.monitoredByOthersSpecify = monitoredByOthersSpecify;
        this.monitoringMethod = monitoringMethod;
        this.reportSharedWithRespondent = reportSharedWithRespondent;
        this.improvementsSeen = improvementsSeen;
        this.improvementsSeenExplanation = improvementsSeenExplanation;
        this.progressReportsSubmitted = progressReportsSubmitted;
        this.progressReportsSubmittedExplanation = progressReportsSubmittedExplanation;
        this.selfRelianceBeneficiariesCount = selfRelianceBeneficiariesCount;
        this.selfRelianceGroupProjectsCount = selfRelianceGroupProjectsCount;
    }

    public Long getAmountExpected() { return amountExpected; }
    public Long getAmountReceived() { return amountReceived; }
    public Integer getTotalBeneficiaries() { return totalBeneficiaries; }
    public Integer getYouthBeneficiaries() { return youthBeneficiaries; }
    public Integer getYoungWomenBeneficiaries() { return youngWomenBeneficiaries; }
    public String getObstaclesDescription() { return obstaclesDescription; }
    public Boolean getSpendingTargetedToMostInNeed() { return spendingTargetedToMostInNeed; }
    public Integer getPdcTotalMembers() { return pdcTotalMembers; }
    public Integer getPdcYouthMembers() { return pdcYouthMembers; }
    public Integer getPdcWomenMembers() { return pdcWomenMembers; }
    public Boolean getPdcTrainingReceived() { return pdcTrainingReceived; }
    public List<String> getPdcTrainingAreas() { return pdcTrainingAreas; }
    public String getPdcEffectivenessRating() { return pdcEffectivenessRating; }
    public List<String> getMonitoredBy() { return monitoredBy; }
    public String getMonitoredByOthersSpecify() { return monitoredByOthersSpecify; }
    public String getMonitoringMethod() { return monitoringMethod; }
    public Boolean getReportSharedWithRespondent() { return reportSharedWithRespondent; }
    public Boolean getImprovementsSeen() { return improvementsSeen; }
    public String getImprovementsSeenExplanation() { return improvementsSeenExplanation; }
    public Boolean getProgressReportsSubmitted() { return progressReportsSubmitted; }
    public String getProgressReportsSubmittedExplanation() { return progressReportsSubmittedExplanation; }
    public Integer getSelfRelianceBeneficiariesCount() { return selfRelianceBeneficiariesCount; }
    public Integer getSelfRelianceGroupProjectsCount() { return selfRelianceGroupProjectsCount; }
}
