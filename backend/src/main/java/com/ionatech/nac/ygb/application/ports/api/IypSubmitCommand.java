package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record IypSubmitCommand(
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
        Boolean awareOfPdm,
        Boolean eligibleCriteriaAware,
        Boolean appliedForFund,
        Boolean accessedFund,
        String rejectionNarrative,
        List<String> reasonsForNotApplying,
        List<String> informationChannels,
        List<String> difficultiesFaced,
        String limitationExplanation,
        String improvementSuggestion
) implements SubmitSubmissionCommand {}
