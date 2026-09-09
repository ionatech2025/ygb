package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetrics;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetricsPage;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.PageRequest;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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
    void shouldAssembleGlobalTotalsAndPagedPerCollectorRows() {
        PageRequest pageRequest = PageRequest.of(0, 25);
        when(repositoryPort.countByStatus(SubmissionStatus.SYNCED)).thenReturn(5L);
        when(repositoryPort.countByStatus(SubmissionStatus.FLAGGED)).thenReturn(2L);
        when(repositoryPort.countByStatus(SubmissionStatus.DUPLICATE)).thenReturn(1L);
        when(repositoryPort.findReceiptMetricsByCollector(pageRequest)).thenReturn(new CollectorReceiptMetricsPage(
                List.of(
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
                ),
                2L,
                0,
                25
        ));

        AdminReceiptStatus status = service.getReceiptStatus(pageRequest);

        assertThat(status.totalSynced()).isEqualTo(5L);
        assertThat(status.totalFlagged()).isEqualTo(2L);
        assertThat(status.totalDuplicate()).isEqualTo(1L);
        assertThat(status.byCollector().items()).hasSize(2);
        assertThat(status.byCollector().totalElements()).isEqualTo(2L);

        CollectorReceiptStatus active = status.byCollector().items().stream()
                .filter(entry -> entry.collectorId().equals(activeCollectorId))
                .findFirst()
                .orElseThrow();
        assertThat(active.stale()).isFalse();

        CollectorReceiptStatus stale = status.byCollector().items().stream()
                .filter(entry -> entry.collectorId().equals(staleCollectorId))
                .findFirst()
                .orElseThrow();
        assertThat(stale.stale()).isTrue();
        verify(repositoryPort).findReceiptMetricsByCollector(pageRequest);
    }

    @Test
    void shouldMarkCollectorWithoutAnySyncedReceiptAsStale() {
        PageRequest pageRequest = PageRequest.of(1, 10);
        when(repositoryPort.countByStatus(SubmissionStatus.SYNCED)).thenReturn(0L);
        when(repositoryPort.countByStatus(SubmissionStatus.FLAGGED)).thenReturn(0L);
        when(repositoryPort.countByStatus(SubmissionStatus.DUPLICATE)).thenReturn(0L);
        when(repositoryPort.findReceiptMetricsByCollector(pageRequest)).thenReturn(new CollectorReceiptMetricsPage(
                List.of(
                        new CollectorReceiptMetrics(
                                staleCollectorId,
                                "Never Synced",
                                0L,
                                0L,
                                0L,
                                null
                        )
                ),
                11L,
                1,
                10
        ));

        AdminReceiptStatus status = service.getReceiptStatus(pageRequest);

        assertThat(status.byCollector().page()).isEqualTo(1);
        assertThat(status.byCollector().totalPages()).isEqualTo(2);
        assertThat(status.byCollector().items()).singleElement().satisfies(entry -> {
            assertThat(entry.lastReceivedAt()).isNull();
            assertThat(entry.stale()).isTrue();
        });
    }
}
