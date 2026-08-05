package com.ionatech.nac.ygb.application.ports.api;

import java.time.LocalDateTime;
import java.util.UUID;

public record RegisteredDownloadSessionView(
        UUID profileId,
        String token,
        LocalDateTime expiresAt
) {
}
