package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminReceiptStatusResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorReceiptStatusDto;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import org.springframework.stereotype.Component;

@Component
public class AdminReceiptStatusRestMapper {

    public AdminReceiptStatusResponseDto toResponse(AdminReceiptStatus status) {
        return new AdminReceiptStatusResponseDto(
                status.totalSynced(),
                status.totalFlagged(),
                status.totalDuplicate(),
                status.byCollector().stream().map(this::toCollectorDto).toList()
        );
    }

    private CollectorReceiptStatusDto toCollectorDto(CollectorReceiptStatus status) {
        return new CollectorReceiptStatusDto(
                status.collectorId(),
                status.fullName(),
                status.syncedCount(),
                status.flaggedCount(),
                status.duplicateCount(),
                status.lastReceivedAt(),
                status.stale()
        );
    }
}
