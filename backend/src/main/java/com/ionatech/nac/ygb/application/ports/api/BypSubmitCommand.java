package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;
import com.ionatech.nac.ygb.domain.valueobjects.Rating;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record BypSubmitCommand(
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
) implements SubmitSubmissionCommand {}
