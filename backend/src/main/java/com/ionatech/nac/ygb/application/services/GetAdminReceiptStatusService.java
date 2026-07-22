package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.GetAdminReceiptStatusQuery;
import com.ionatech.nac.ygb.application.ports.spi.SubmissionRepositoryPort;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptMetrics;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.SubmissionStatus;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public class GetAdminReceiptStatusService implements GetAdminReceiptStatusQuery {

    static final Duration STALE_THRESHOLD = Duration.ofHours(48);

    private final SubmissionRepositoryPort repositoryPort;

    public GetAdminReceiptStatusService(SubmissionRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public AdminReceiptStatus getReceiptStatus() {
        long totalSynced = repositoryPort.countByStatus(SubmissionStatus.SYNCED);
        long totalFlagged = repositoryPort.countByStatus(SubmissionStatus.FLAGGED);
        long totalDuplicate = repositoryPort.countByStatus(SubmissionStatus.DUPLICATE);

        List<CollectorReceiptStatus> byCollector = repositoryPort.findReceiptMetricsByCollector().stream()
                .map(this::toCollectorReceiptStatus)
                .toList();

        return new AdminReceiptStatus(totalSynced, totalFlagged, totalDuplicate, byCollector);
    }

    private CollectorReceiptStatus toCollectorReceiptStatus(CollectorReceiptMetrics metrics) {
        LocalDateTime lastReceivedAt = metrics.lastReceivedAt();
        boolean stale = lastReceivedAt == null
                || lastReceivedAt.isBefore(LocalDateTime.now().minus(STALE_THRESHOLD));
        return new CollectorReceiptStatus(
                metrics.collectorId(),
                metrics.fullName(),
                metrics.syncedCount(),
                metrics.flaggedCount(),
                metrics.duplicateCount(),
                lastReceivedAt,
                stale
        );
    }
}
