package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorSubmissionCountQuery;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public class GetCollectorSubmissionCountService implements GetCollectorSubmissionCountQuery {
    private final SubmissionRepositoryPort repositoryPort;

    public GetCollectorSubmissionCountService(SubmissionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public long getDailyCount(UUID collectorId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        return repositoryPort.countByCollectorIdAndFormCompletedAtBetween(collectorId, startOfDay, endOfDay);
    }
}
