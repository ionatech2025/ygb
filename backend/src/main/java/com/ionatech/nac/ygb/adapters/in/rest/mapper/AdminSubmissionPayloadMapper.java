package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.model.*;
import com.ionatech.nac.ygb.domain.valueobjects.NarrativeText;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminSubmissionPayloadMapper {

    public SubmissionRequestDto toPayload(Submission submission) {
        return switch (submission) {
            case BypSubmission byp -> toBypDto(byp);
            case IypSubmission iyp -> toIypDto(iyp);
            case LgoSubmission lgo -> toLgoDto(lgo);
            case PcSubmission pc -> toPcDto(pc);
            default -> throw new IllegalArgumentException("Unknown submission type: " + submission.getClass());
        };
    }

    private BypSubmissionRequestDto toBypDto(BypSubmission submission) {
        return new BypSubmissionRequestDto(
                "BYP",
                submission.getMetadata().deviceSubmissionId(),
                submission.getMetadata().formCompletedAt(),
                submission.getLocation().districtId(),
                submission.getLocation().subcountyId(),
                submission.getLocation().parishId(),
                submission.getLocation().villageId(),
                submission.getRespondentName(),
                submission.getRespondentPhone(),
                submission.getRespondentGender(),
                submission.getRespondentAgeGroup(),
                submission.getExactAge().getValue(),
                submission.getFundReceiptDuration(),
                submission.getFundReceiptDurationSpecify(),
                submission.getReceivedActualAmountRequested(),
                submission.getCashAmountReceived(),
                submission.getInstalmentPeriod(),
                submission.getInstalmentPeriodSpecify(),
                submission.getServiceRating(),
                submission.getPerformanceRating(),
                submission.getGroupOrganizedTransparently(),
                submission.getReceivedBds(),
                submission.getBdsServices(),
                narrativeValue(submission.getImprovementSuggestion())
        );
    }

    private IypSubmissionRequestDto toIypDto(IypSubmission submission) {
        return new IypSubmissionRequestDto(
                "IYP",
                submission.getMetadata().deviceSubmissionId(),
                submission.getMetadata().formCompletedAt(),
                submission.getLocation().districtId(),
                submission.getLocation().subcountyId(),
                submission.getLocation().parishId(),
                submission.getLocation().villageId(),
                submission.getRespondentName(),
                submission.getRespondentPhone(),
                submission.getRespondentGender(),
                submission.getRespondentAgeGroup(),
                submission.isAwareOfPdm(),
                submission.getEligibleCriteriaAware(),
                submission.getAppliedForFund(),
                submission.isAccessedFund(),
                narrativeValue(submission.getRejectionNarrative()),
                submission.getReasonsForNotApplying(),
                submission.getInformationChannels(),
                submission.getDifficultiesFaced(),
                narrativeValue(submission.getLimitationExplanation()),
                narrativeValue(submission.getImprovementSuggestion())
        );
    }

    private LgoSubmissionRequestDto toLgoDto(LgoSubmission submission) {
        return new LgoSubmissionRequestDto(
                "LGO",
                submission.getMetadata().deviceSubmissionId(),
                submission.getMetadata().formCompletedAt(),
                submission.getLocation().districtId(),
                submission.getLocation().subcountyId(),
                submission.getLocation().parishId(),
                submission.getLocation().villageId(),
                submission.getRespondentName(),
                submission.getRespondentPhone(),
                submission.getRespondentGender(),
                submission.getRespondentAgeGroup(),
                submission.getFiscalYearRecords(),
                submission.getFundsAllocatedEquitably(),
                submission.getAllocatedFundsSufficient(),
                submission.getAdequateUtilisationOversight(),
                submission.getTransparentBeneficiarySelection(),
                submission.getFundsSpentAsRequired(),
                narrativeValue(submission.getFundsSpentExplanation()),
                submission.getEconomicTransformation(),
                narrativeValue(submission.getEconomicTransformationExplanation()),
                narrativeValue(submission.getImprovementSuggestion())
        );
    }

    private PcSubmissionRequestDto toPcDto(PcSubmission submission) {
        return new PcSubmissionRequestDto(
                "PC",
                submission.getMetadata().deviceSubmissionId(),
                submission.getMetadata().formCompletedAt(),
                submission.getLocation().districtId(),
                submission.getLocation().subcountyId(),
                submission.getLocation().parishId(),
                submission.getLocation().villageId(),
                submission.getRespondentName(),
                submission.getRespondentPhone(),
                submission.getRespondentGender(),
                submission.getRespondentAgeGroup(),
                submission.getAmountExpected(),
                submission.getAmountReceived(),
                submission.getTotalBeneficiaries(),
                submission.getYouthBeneficiaries(),
                submission.getYoungWomenBeneficiaries(),
                narrativeValue(submission.getObstaclesDescription()),
                submission.getSpendingTargetedToMostInNeed(),
                submission.getPdcTotalMembers(),
                submission.getPdcYouthMembers(),
                submission.getPdcWomenMembers(),
                submission.getPdcTrainingReceived(),
                copyList(submission.getPdcTrainingAreas()),
                submission.getPdcEffectivenessRating(),
                submission.getMonitoredBy(),
                submission.getMonitoredByOthersSpecify(),
                narrativeValue(submission.getMonitoringMethod()),
                submission.getReportSharedWithRespondent(),
                submission.getImprovementsSeen(),
                narrativeValue(submission.getImprovementsSeenExplanation()),
                submission.getProgressReportsSubmitted(),
                narrativeValue(submission.getProgressReportsSubmittedExplanation()),
                submission.getSelfRelianceBeneficiariesCount(),
                submission.getSelfRelianceGroupProjectsCount()
        );
    }

    private static String narrativeValue(NarrativeText narrativeText) {
        return narrativeText != null ? narrativeText.getValue() : null;
    }

    private static List<String> copyList(List<String> values) {
        return values == null ? List.of() : List.copyOf(values);
    }
}
