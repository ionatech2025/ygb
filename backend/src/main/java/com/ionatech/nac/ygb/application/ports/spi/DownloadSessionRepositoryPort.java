package com.ionatech.nac.ygb.application.ports.spi;

import com.ionatech.nac.ygb.domain.model.DownloadSession;

import java.util.Optional;

public interface DownloadSessionRepositoryPort {
    DownloadSession save(DownloadSession session);

    Optional<DownloadSession> findByToken(String token);
}
