package com.ionatech.nac.ygb.adapters.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DownloadSessionResponseDto(
        UUID profileId,
        String token,
        LocalDateTime expiresAt
) {
}
