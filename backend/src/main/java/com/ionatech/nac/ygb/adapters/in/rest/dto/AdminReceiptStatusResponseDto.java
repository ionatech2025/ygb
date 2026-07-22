package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AdminReceiptStatusResponseDto(
        long totalSynced,
        long totalFlagged,
        long totalDuplicate,
        List<CollectorReceiptStatusDto> byCollector
) {}
