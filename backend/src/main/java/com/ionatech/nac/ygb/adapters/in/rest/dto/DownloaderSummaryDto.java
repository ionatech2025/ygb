package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DownloaderSummaryDto(
        UUID profileId,
        String email,
        String optionalName,
        String countryCode,
        String gender,
        String ageGroup,
        String fieldOfOperation,
        String fieldOfOperationSpecify,
        LocalDateTime registeredAt,
        long downloadCount,
        LocalDateTime lastDownloadedAt
) {
}
