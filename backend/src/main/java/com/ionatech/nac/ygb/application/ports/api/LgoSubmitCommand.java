package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.FiscalYearRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record LgoSubmitCommand(
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
        List<FiscalYearRecord> fiscalYearRecords,
        Boolean fundsAllocatedEquitably,
        Boolean allocatedFundsSufficient,
        Boolean adequateUtilisationOversight,
        Boolean transparentBeneficiarySelection,
        Boolean fundsSpentAsRequired,
        String fundsSpentExplanation,
        Boolean economicTransformation,
        String economicTransformationExplanation,
        String improvementSuggestion
) implements SubmitSubmissionCommand {}
