package com.ionatech.nac.ygb.domain.valueobjects;

import java.time.LocalDateTime;
import java.util.UUID;

public record DownloaderSummary(
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
    public DownloaderSummary {
        if (profileId == null) {
            throw new IllegalArgumentException("profileId must not be null");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        if (downloadCount < 0) {
            throw new IllegalArgumentException("downloadCount must not be negative");
        }
    }
}
