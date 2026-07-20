package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetCollectorSyncStatusQuery;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorSyncStatus;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class GetCollectorSyncStatusService implements GetCollectorSyncStatusQuery {

    private final SubmissionRepositoryPort repositoryPort;

    public GetCollectorSyncStatusService(SubmissionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public CollectorSyncStatus getSyncStatus(UUID collectorId) {
        long synced = repositoryPort.countByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED);
        LocalDateTime lastSyncedAt = repositoryPort.findLatestSyncedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED)
                .orElse(null);

        return new CollectorSyncStatus(synced, lastSyncedAt);
    }
}
