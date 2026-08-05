package com.ionatech.nac.ygb.domain.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class DownloadSession {
    public static final Duration DEFAULT_TTL = Duration.ofHours(1);

    private final UUID id;
    private final UUID profileId;
    private final String token;
    private final LocalDateTime issuedAt;
    private final LocalDateTime expiresAt;

    private DownloadSession(
            UUID id,
            UUID profileId,
            String token,
            LocalDateTime issuedAt,
            LocalDateTime expiresAt
    ) {
        this.id = id;
        this.profileId = profileId;
        this.token = token;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
    }

    public static DownloadSession issue(UUID profileId, String token, LocalDateTime issuedAt) {
        Objects.requireNonNull(profileId, "Profile id cannot be null");
        Objects.requireNonNull(issuedAt, "Issued timestamp cannot be null");
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Session token cannot be blank");
        }
        return new DownloadSession(
                UUID.randomUUID(),
                profileId,
                token.trim(),
                issuedAt,
                issuedAt.plus(DEFAULT_TTL)
        );
    }

    public static DownloadSession rehydrate(
            UUID id,
            UUID profileId,
            String token,
            LocalDateTime issuedAt,
            LocalDateTime expiresAt
    ) {
        return new DownloadSession(id, profileId, token, issuedAt, expiresAt);
    }

    public boolean isUsableAt(LocalDateTime moment) {
        Objects.requireNonNull(moment, "Moment cannot be null");
        return moment.isBefore(expiresAt);
    }

    public UUID getId() {
        return id;
    }

    public UUID getProfileId() {
        return profileId;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}
