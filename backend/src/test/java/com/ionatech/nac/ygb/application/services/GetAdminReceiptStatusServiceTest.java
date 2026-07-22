package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetrics;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetAdminReceiptStatusServiceTest {

    private SubmissionRepositoryPort repositoryPort;
    private GetAdminReceiptStatusService service;

    private final UUID activeCollectorId = UUID.randomUUID();
    private final UUID staleCollectorId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        repositoryPort = mock(SubmissionRepositoryPort.class);
        service = new GetAdminReceiptStatusService(repositoryPort);
    }

    @Test
    void shouldAssembleGlobalTotalsAndPerCollectorRows() {
        when(repositoryPort.countByStatus(SubmissionStatus.SYNCED)).thenReturn(5L);
        when(repositoryPort.countByStatus(SubmissionStatus.FLAGGED)).thenReturn(2L);
        when(repositoryPort.countByStatus(SubmissionStatus.DUPLICATE)).thenReturn(1L);
        when(repositoryPort.findReceiptMetricsByCollector()).thenReturn(List.of(
                new CollectorReceiptMetrics(
                        activeCollectorId,
                        "Active Collector",
                        5L,
                        2L,
                        1L,
                        LocalDateTime.now().minusHours(1)
                ),
                new CollectorReceiptMetrics(
                        staleCollectorId,
                        "Stale Collector",
                        0L,
                        0L,
                        0L,
                        LocalDateTime.now().minusHours(72)
                )
        ));

        AdminReceiptStatus status = service.getReceiptStatus();

        assertThat(status.totalSynced()).isEqualTo(5L);
        assertThat(status.totalFlagged()).isEqualTo(2L);
        assertThat(status.totalDuplicate()).isEqualTo(1L);
        assertThat(status.byCollector()).hasSize(2);

        CollectorReceiptStatus active = status.byCollector().stream()
                .filter(entry -> entry.collectorId().equals(activeCollectorId))
                .findFirst()
                .orElseThrow();
        assertThat(active.stale()).isFalse();

        CollectorReceiptStatus stale = status.byCollector().stream()
                .filter(entry -> entry.collectorId().equals(staleCollectorId))
                .findFirst()
                .orElseThrow();
        assertThat(stale.stale()).isTrue();
    }

    @Test
    void shouldMarkCollectorWithoutAnySyncedReceiptAsStale() {
        when(repositoryPort.countByStatus(SubmissionStatus.SYNCED)).thenReturn(0L);
        when(repositoryPort.countByStatus(SubmissionStatus.FLAGGED)).thenReturn(0L);
        when(repositoryPort.countByStatus(SubmissionStatus.DUPLICATE)).thenReturn(0L);
        when(repositoryPort.findReceiptMetricsByCollector()).thenReturn(List.of(
                new CollectorReceiptMetrics(
                        staleCollectorId,
                        "Never Synced",
                        0L,
                        0L,
                        0L,
                        null
                )
        ));

        AdminReceiptStatus status = service.getReceiptStatus();

        assertThat(status.byCollector()).singleElement().satisfies(entry -> {
            assertThat(entry.lastReceivedAt()).isNull();
            assertThat(entry.stale()).isTrue();
        });
    }
}
