package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorSyncStatus;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class GetCollectorSyncStatusServiceTest {

    private SubmissionRepositoryPort repositoryPort;
    private GetCollectorSyncStatusService service;

    @BeforeEach
    void setUp() {
        repositoryPort = mock(SubmissionRepositoryPort.class);
        service = new GetCollectorSyncStatusService(repositoryPort);
    }

    @Test
    void shouldAssembleSyncStatusCorrectly() {
        UUID collectorId = UUID.randomUUID();
        LocalDateTime latestTime = LocalDateTime.of(2026, 7, 19, 12, 0);

        when(repositoryPort.countByCollectorIdAndStatus(collectorId, SubmissionStatus.PENDING)).thenReturn(3L);
        when(repositoryPort.countByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED)).thenReturn(12L);
        when(repositoryPort.findLatestFormCompletedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED))
                .thenReturn(Optional.of(latestTime));

        CollectorSyncStatus status = service.getSyncStatus(collectorId);

        assertThat(status.pendingCount()).isEqualTo(3L);
        assertThat(status.syncedCount()).isEqualTo(12L);
        assertThat(status.lastSyncedAt()).isEqualTo(latestTime);

        verify(repositoryPort, times(1)).countByCollectorIdAndStatus(collectorId, SubmissionStatus.PENDING);
        verify(repositoryPort, times(1)).countByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED);
        verify(repositoryPort, times(1)).findLatestFormCompletedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED);
    }

    @Test
    void shouldHandleNullLastSyncedAtWhenNoSyncedSubmissionsExist() {
        UUID collectorId = UUID.randomUUID();

        when(repositoryPort.countByCollectorIdAndStatus(collectorId, SubmissionStatus.PENDING)).thenReturn(0L);
        when(repositoryPort.countByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED)).thenReturn(0L);
        when(repositoryPort.findLatestFormCompletedAtByCollectorIdAndStatus(collectorId, SubmissionStatus.SYNCED))
                .thenReturn(Optional.empty());

        CollectorSyncStatus status = service.getSyncStatus(collectorId);

        assertThat(status.pendingCount()).isEqualTo(0L);
        assertThat(status.syncedCount()).isEqualTo(0L);
        assertThat(status.lastSyncedAt()).isNull();
    }
}
