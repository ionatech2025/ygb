package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.AgeGroup;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record RecordLgoBudgetAllocationCommand(
        UUID collectorUserId,
        UUID deviceSubmissionId,
        LocalDateTime formCompletedAt,
        String respondentName,
        String respondentPhone,
        String respondentGender,
        AgeGroup respondentAgeGroup,
        UUID districtId,
        UUID subcountyId,
        UUID parishId,
        UUID villageId,
        Map<String, Object> priorYearAllocations,
        String rationale,
        String recommendations
) {
}
