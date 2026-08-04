package com.ionatech.nac.ygb.application.services;

import com.ionatech.nac.ygb.application.ports.api.AuthorizePublicDownloadUseCase;
import com.ionatech.nac.ygb.application.ports.spi.DownloadEventRepositoryPort;
import com.ionatech.nac.ygb.application.ports.spi.DownloadSessionRepositoryPort;
import com.ionatech.nac.ygb.domain.exceptions.InvalidDownloadSessionException;
import com.ionatech.nac.ygb.domain.model.DownloadEvent;
import com.ionatech.nac.ygb.domain.model.DownloadSession;
import com.ionatech.nac.ygb.domain.valueobjects.ExportFormat;
import com.ionatech.nac.ygb.domain.valueobjects.PublicDownloadDataset;

import java.time.Clock;
import java.time.LocalDateTime;

public class AuthorizePublicDownloadService implements AuthorizePublicDownloadUseCase {

    private final DownloadSessionRepositoryPort sessionRepository;
    private final DownloadEventRepositoryPort eventRepository;
    private final Clock clock;

    public AuthorizePublicDownloadService(
            DownloadSessionRepositoryPort sessionRepository,
            DownloadEventRepositoryPort eventRepository,
            Clock clock
    ) {
        this.sessionRepository = sessionRepository;
        this.eventRepository = eventRepository;
        this.clock = clock;
    }

    @Override
    public DownloadSession authorizeAndRecord(
            String sessionToken,
            PublicDownloadDataset dataset,
            ExportFormat format,
            String filterFingerprint
    ) {
        if (sessionToken == null || sessionToken.isBlank()) {
            throw new InvalidDownloadSessionException("Download session required. Register a download profile first.");
        }

        LocalDateTime now = LocalDateTime.ofInstant(clock.instant(), clock.getZone());
        DownloadSession session = sessionRepository.findByToken(sessionToken.trim())
                .orElseThrow(() -> new InvalidDownloadSessionException("Unknown or invalid download session."));

        if (!session.isUsableAt(now)) {
            throw new InvalidDownloadSessionException("Download session has expired. Register again to continue.");
        }

        eventRepository.save(DownloadEvent.recordNew(
                session.getProfileId(),
                session.getId(),
                dataset,
                format,
                now,
                filterFingerprint
        ));

        return session;
    }
}
