package com.ionatech.nac.ygb.application.ports.api;

import com.ionatech.nac.ygb.domain.valueobjects.CollectorSyncStatus;

import java.util.UUID;

public interface GetCollectorSyncStatusQuery {
    CollectorSyncStatus getSyncStatus(UUID collectorId);
}
