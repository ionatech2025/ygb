package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public record RecordLgoBudgetAllocationResult(
        UUID submissionId,
        UUID lbaId,
        String status
) {
}
