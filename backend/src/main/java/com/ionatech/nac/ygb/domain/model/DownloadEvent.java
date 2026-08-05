package com.ionatech.nac.ygb.domain.model;

import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class DownloadEvent {
    private final UUID id;
    private final UUID profileId;
    private final UUID sessionId;
    private final PublicDownloadDataset dataset;
    private final ExportFormat format;
    private final LocalDateTime downloadedAt;
    private final String filterFingerprint;

    private DownloadEvent(
            UUID id,
            UUID profileId,
            UUID sessionId,
            PublicDownloadDataset dataset,
            ExportFormat format,
            LocalDateTime downloadedAt,
            String filterFingerprint
    ) {
        this.id = id;
        this.profileId = profileId;
        this.sessionId = sessionId;
        this.dataset = dataset;
        this.format = format;
        this.downloadedAt = downloadedAt;
        this.filterFingerprint = filterFingerprint;
    }

    public static DownloadEvent recordNew(
            UUID profileId,
            UUID sessionId,
            PublicDownloadDataset dataset,
            ExportFormat format,
            LocalDateTime downloadedAt,
            String filterFingerprint
    ) {
        Objects.requireNonNull(profileId, "Profile id cannot be null");
        Objects.requireNonNull(sessionId, "Session id cannot be null");
        Objects.requireNonNull(dataset, "Dataset cannot be null");
        Objects.requireNonNull(format, "Format cannot be null");
        Objects.requireNonNull(downloadedAt, "Downloaded timestamp cannot be null");
        if (format == ExportFormat.PDF) {
            throw new IllegalArgumentException("Public download events support CSV and XLSX only");
        }
        return new DownloadEvent(
                UUID.randomUUID(),
                profileId,
                sessionId,
                dataset,
                format,
                downloadedAt,
                filterFingerprint == null || filterFingerprint.isBlank() ? null : filterFingerprint.trim()
        );
    }

    public static DownloadEvent rehydrate(
            UUID id,
            UUID profileId,
            UUID sessionId,
            PublicDownloadDataset dataset,
            ExportFormat format,
            LocalDateTime downloadedAt,
            String filterFingerprint
    ) {
        return new DownloadEvent(id, profileId, sessionId, dataset, format, downloadedAt, filterFingerprint);
    }

    public UUID getId() {
        return id;
    }

    public UUID getProfileId() {
        return profileId;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public PublicDownloadDataset getDataset() {
        return dataset;
    }

    public ExportFormat getFormat() {
        return format;
    }

    public LocalDateTime getDownloadedAt() {
        return downloadedAt;
    }

    public String getFilterFingerprint() {
        return filterFingerprint;
    }
}
