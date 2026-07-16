package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.*;

import java.util.List;
import java.util.UUID;

public class PcSubmission extends Submission {
    private final Long amountExpected;
    private final Long amountReceived;
    private final Integer totalBeneficiaries;
    private final Integer youthBeneficiaries;
    private final Integer youngWomenBeneficiaries;
    private final NarrativeText obstaclesDescription;
    private final Boolean spendingTargetedToMostInNeed;
    private final Integer pdcTotalMembers;
    private final Integer pdcYouthMembers;
    private final Integer pdcWomenMembers;
    private final Boolean pdcTrainingReceived;
    private final List<String> pdcTrainingAreas;
    private final String pdcEffectivenessRating;
    private final List<String> monitoredBy;
    private final String monitoredByOthersSpecify;
    private final NarrativeText monitoringMethod;
    private final Boolean reportSharedWithRespondent;
    private final Boolean improvementsSeen;
    private final NarrativeText improvementsSeenExplanation;
    private final Boolean progressReportsSubmitted;
    private final NarrativeText progressReportsSubmittedExplanation;
    private final Integer selfRelianceBeneficiariesCount;
    private final Integer selfRelianceGroupProjectsCount;

    public PcSubmission(
            UUID id,
            SubmissionMetadata metadata,
            Location location,
            String respondentName,
            String respondentPhone,
            String respondentGender,
            AgeGroup respondentAgeGroup,
            Long amountExpected,
            Long amountReceived,
            Integer totalBeneficiaries,
            Integer youthBeneficiaries,
            Integer youngWomenBeneficiaries,
            NarrativeText obstaclesDescription,
            Boolean spendingTargetedToMostInNeed,
            Integer pdcTotalMembers,
            Integer pdcYouthMembers,
            Integer pdcWomenMembers,
            Boolean pdcTrainingReceived,
            List<String> pdcTrainingAreas,
            String pdcEffectivenessRating,
            List<String> monitoredBy,
            String monitoredByOthersSpecify,
            NarrativeText monitoringMethod,
            Boolean reportSharedWithRespondent,
            Boolean improvementsSeen,
            NarrativeText improvementsSeenExplanation,
            Boolean progressReportsSubmitted,
            NarrativeText progressReportsSubmittedExplanation,
            Integer selfRelianceBeneficiariesCount,
            Integer selfRelianceGroupProjectsCount
    ) {
        super(id, metadata, location, respondentName, respondentPhone, respondentGender, respondentAgeGroup);
        
        if (amountExpected == null || amountExpected < 0 || amountReceived == null || amountReceived < 0) {
            throw new IllegalArgumentException("Amounts expected and received must be positive");
        }
        if (totalBeneficiaries == null || totalBeneficiaries < 0 || youthBeneficiaries == null || youthBeneficiaries < 0 
                || youngWomenBeneficiaries == null || youngWomenBeneficiaries < 0) {
            throw new IllegalArgumentException("Beneficiary counts must be positive");
        }
        if (obstaclesDescription == null) {
            throw new IllegalArgumentException("Obstacles description is required");
        }
        if (spendingTargetedToMostInNeed == null) {
            throw new IllegalArgumentException("Spending targeted indicator is required");
        }
        if (pdcTotalMembers == null || pdcTotalMembers < 0 || pdcYouthMembers == null || pdcYouthMembers < 0 
                || pdcWomenMembers == null || pdcWomenMembers < 0) {
            throw new IllegalArgumentException("PDC members counts must be positive");
        }
        if (pdcTrainingReceived == null) {
            throw new IllegalArgumentException("PDC training received indicator is required");
        }
        if (pdcEffectivenessRating == null || pdcEffectivenessRating.trim().isEmpty()) {
            throw new IllegalArgumentException("PDC effectiveness rating is required");
        }
        if (monitoredBy == null || monitoredBy.isEmpty()) {
            throw new IllegalArgumentException("Monitored by list cannot be empty");
        }
        if (monitoringMethod == null) {
            throw new IllegalArgumentException("Monitoring method is required");
        }
        if (reportSharedWithRespondent == null) {
            throw new IllegalArgumentException("Report shared indicator is required");
        }
        if (improvementsSeen == null) {
            throw new IllegalArgumentException("Improvements seen indicator is required");
        }
        if (progressReportsSubmitted == null) {
            throw new IllegalArgumentException("Progress reports indicator is required");
        }
        if (selfRelianceBeneficiariesCount == null || selfRelianceBeneficiariesCount < 0 
                || selfRelianceGroupProjectsCount == null || selfRelianceGroupProjectsCount < 0) {
            throw new IllegalArgumentException("Self-reliance counts must be positive");
        }

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
        this.pdcTrainingAreas = pdcTrainingAreas == null ? List.of() : List.copyOf(pdcTrainingAreas);
        this.pdcEffectivenessRating = pdcEffectivenessRating;
        this.monitoredBy = List.copyOf(monitoredBy);
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

    public Long getAmountExpected() {
        return amountExpected;
    }

    public Long getAmountReceived() {
        return amountReceived;
    }

    public Integer getTotalBeneficiaries() {
        return totalBeneficiaries;
    }

    public Integer getYouthBeneficiaries() {
        return youthBeneficiaries;
    }

    public Integer getYoungWomenBeneficiaries() {
        return youngWomenBeneficiaries;
    }

    public NarrativeText getObstaclesDescription() {
        return obstaclesDescription;
    }

    public Boolean getSpendingTargetedToMostInNeed() {
        return spendingTargetedToMostInNeed;
    }

    public Integer getPdcTotalMembers() {
        return pdcTotalMembers;
    }

    public Integer getPdcYouthMembers() {
        return pdcYouthMembers;
    }

    public Integer getPdcWomenMembers() {
        return pdcWomenMembers;
    }

    public Boolean getPdcTrainingReceived() {
        return pdcTrainingReceived;
    }

    public List<String> getPdcTrainingAreas() {
        return pdcTrainingAreas;
    }

    public String getPdcEffectivenessRating() {
        return pdcEffectivenessRating;
    }

    public List<String> getMonitoredBy() {
        return monitoredBy;
    }

    public String getMonitoredByOthersSpecify() {
        return monitoredByOthersSpecify;
    }

    public NarrativeText getMonitoringMethod() {
        return monitoringMethod;
    }

    public Boolean getReportSharedWithRespondent() {
        return reportSharedWithRespondent;
    }

    public Boolean getImprovementsSeen() {
        return improvementsSeen;
    }

    public NarrativeText getImprovementsSeenExplanation() {
        return improvementsSeenExplanation;
    }

    public Boolean getProgressReportsSubmitted() {
        return progressReportsSubmitted;
    }

    public NarrativeText getProgressReportsSubmittedExplanation() {
        return progressReportsSubmittedExplanation;
    }

    public Integer getSelfRelianceBeneficiariesCount() {
        return selfRelianceBeneficiariesCount;
    }

    public Integer getSelfRelianceGroupProjectsCount() {
        return selfRelianceGroupProjectsCount;
    }

    @Override
    public void validate() {
        if (Boolean.TRUE.equals(pdcTrainingReceived) && pdcTrainingAreas.isEmpty()) {
            throw new IllegalArgumentException("PDC training areas list cannot be empty when pdcTrainingReceived is true");
        }
        if (monitoredBy.contains("OTHERS")) {
            if (monitoredByOthersSpecify == null || monitoredByOthersSpecify.trim().isEmpty()) {
                throw new IllegalArgumentException("monitoredByOthersSpecify is required when monitoredBy contains OTHERS");
            }
        }
        if (Boolean.TRUE.equals(improvementsSeen) && improvementsSeenExplanation == null) {
            throw new IllegalArgumentException("improvementsSeenExplanation is required when improvementsSeen is true");
        }
        if (Boolean.TRUE.equals(progressReportsSubmitted) && progressReportsSubmittedExplanation == null) {
            throw new IllegalArgumentException("progressReportsSubmittedExplanation is required when progressReportsSubmitted is true");
        }
    }
}
