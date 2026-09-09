package com.ionatech.nac.ygb.adapters.in.rest.dto;

public record AdminReceiptStatusResponseDto(
        long totalSynced,
        long totalFlagged,
        long totalDuplicate,
        CollectorReceiptPageResponseDto byCollector
) {}
