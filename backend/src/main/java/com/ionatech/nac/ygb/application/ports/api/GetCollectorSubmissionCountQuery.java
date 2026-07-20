package com.ionatech.nac.ygb.application.ports.api;

import java.util.UUID;

public interface GetCollectorSubmissionCountQuery {
    long getDailyCount(UUID collectorId);
}
