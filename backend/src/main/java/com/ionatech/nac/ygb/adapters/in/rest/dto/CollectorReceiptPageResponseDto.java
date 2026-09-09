package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.util.List;

public record CollectorReceiptPageResponseDto(
        List<CollectorReceiptStatusDto> items,
        long totalElements,
        int page,
        int size,
        int totalPages
) {
}
