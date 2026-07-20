package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PcSubmitCommand(
        UUID collectorId,
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
) implements SubmitSubmissionCommand {}
