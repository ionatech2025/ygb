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
) implements SubmitSubmissionCommand {}
