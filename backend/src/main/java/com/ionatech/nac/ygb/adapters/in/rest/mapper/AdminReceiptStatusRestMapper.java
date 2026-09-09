package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.AdminReceiptStatusResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorReceiptPageResponseDto;
import com.ionatech.nac.ygb.adapters.in.rest.dto.CollectorReceiptStatusDto;
import com.ionatech.nac.ygb.domain.valueobjects.AdminReceiptStatus;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptPage;
import com.ionatech.nac.ygb.domain.valueobjects.CollectorReceiptStatus;
import org.springframework.stereotype.Component;

@Component
public class AdminReceiptStatusRestMapper {

    public AdminReceiptStatusResponseDto toResponse(AdminReceiptStatus status) {
        return new AdminReceiptStatusResponseDto(
                status.totalSynced(),
                status.totalFlagged(),
                status.totalDuplicate(),
                toPageResponse(status.byCollector())
        );
    }

    private CollectorReceiptPageResponseDto toPageResponse(CollectorReceiptPage page) {
        return new CollectorReceiptPageResponseDto(
                page.items().stream().map(this::toCollectorDto).toList(),
                page.totalElements(),
                page.page(),
                page.size(),
                page.totalPages()
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
